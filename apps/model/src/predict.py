"""
Usage: predict.py [OPTIONS] INPUT [OUTPUT]

Options:
  -m, --model FILE  Path to YOLOv8 model.
  -f, --force       Overwrite existing images with predictions.
  -d, --debug       Enable debug mode.
  --help            Show this message and exit. 

Examples:  

Run predictions on all images in examples
> python3 predict.py ../examples

Same as above but skips confirmation for overwrites and passes a path to a model
> python3 predict.py -f ../examples --model ../runs/train3/weights/best.pt
"""

from ultralytics import YOLO
from dotenv import load_dotenv
import filetype
import json
import os
import time
import click

load_dotenv()

home = os.environ["PROJECT_DIR"]
DEFAULT_MODEL = f"{home}/runs/train/weights/best.pt"


def is_valid_model_extension(path: click.Path) -> bool:
    return path.lower().endswith(
        (".pt", ".torchscript", ".onnx", ".engine", ".mlpackage", ".pb", ".tflite")
    )


@click.command()
@click.argument(
    "input", type=click.Path(exists=True, file_okay=True, dir_okay=True), nargs=1
)
@click.argument(
    "output",
    type=click.Path(exists=False, file_okay=False, dir_okay=True),
    required=False,
    nargs=1,
)
@click.option(
    "--model",
    "-m",
    default=DEFAULT_MODEL,
    type=click.Path(exists=True, dir_okay=False),
    nargs=1,
    help="Path to YOLOv8 model.",
)
@click.option(
    "--force",
    "-f",
    is_flag=True,
    default=False,
    help="Overwrite existing images with predictions.",
)
@click.option("--debug", "-d", is_flag=True, help="Enable debug mode.")
def cli(
    input: click.Path, output: click.Path, model: click.Path, force: bool, debug: bool
):
    if not is_valid_model_extension(model):
        err_msg = (
            f"YOLO model '{model}' doesn't have the correct extension. "
            "Make sure the path is correct or train the model before running predictions. "
            "See https://docs.ultralytics.com/modes/export/#export-formats"
        )
        click.echo(
            click.style(
                err_msg,
                fg="red",
            ),
            err=True,
        )

        return

    start = time.time()

    input = os.path.realpath(os.path.expanduser(input))

    if output:
        if not os.path.isdir(output):
            try:
                os.makedirs(output)
            except OSError:
                pass

    click.echo(
        click.style(
            "Starting predictions...",
            fg="cyan",
        )
    )

    if os.path.isfile(input):
        # If output isn't provided, place the results in the file's directory.
        output = output or os.path.split(input)[0]

        # Separates file name and extension (e.g. 'annas.jpg' -> ['annas', 'jpg])
        file = os.path.basename(input).split(".")
        file_name = file[0]
        extension = file[1]

        if not filetype.is_image(input):
            if filetype.is_extension_supported(extension):
                click.echo(
                    click.style(
                        f"Input file '{input}' is not a valid image. Maybe the file is broken?",
                        fg="red",
                    ),
                    err=True,
                )
            else:
                click.echo(
                    click.style(f"Input file '{input}' is not an image.", fg="red"),
                    err=True,
                )

            return

        model = YOLO(model)
        results = model.predict(input, visualize=debug)

        result = results[0]

        if debug:
            data = json.loads(result.tojson())
            click.echo(click.style(json.dumps(data, indent=2), fg="yellow"))

        out_path = os.path.join(output, f"{file_name}_result.jpg")

        if os.path.exists(out_path) and not force:
            if click.confirm(f"Do you want to overwrite '{out_path}'?"):
                result.save(filename=out_path)
        else:
            result.save(filename=out_path)

    elif os.path.isdir(input):
        # If output isn't provided, place the results in the input directory.
        output = output or input

        images = [
            file
            for file in os.listdir(input)
            if filetype.is_image(os.path.join(input, file))
        ]

        if not images:
            click.echo(
                click.style(
                    f"There are no valid images in directory '{input}'.", fg="red"
                ),
                err=True,
            )
            return

        model = YOLO(model)
        results = model.predict(input, stream=True)

        for _, result in enumerate(results):
            # Separates file name and extension (e.g. annas.jpg -> annas)
            file_name = os.path.basename(result.path).split(".")[0]

            if "result" in file_name:
                continue

            if debug:
                data = json.loads(result.tojson())
                click.echo(click.style(json.dumps(data, indent=2), fg="yellow"))

            out_path = os.path.join(output, f"{file_name}_result.jpg")

            if os.path.exists(out_path) and not force:
                if click.confirm(f"Do you want to overwrite '{out_path}'?"):
                    result.save(filename=out_path)
            else:
                result.save(filename=out_path)

    end = time.time()

    click.echo(
        click.style(
            f"\nCompleted predictions (took {round(end - start)} seconds)", fg="green"
        )
    )


if __name__ == "__main__":
    cli()
