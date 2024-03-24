import {
  Accordion,
  Button,
  Group,
  Image,
  List,
  Modal,
  Stack,
  ThemeIcon,
  Title,
  Text,
  rem,
} from '@mantine/core';
import { IconInfoSquareFilled } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { FILE_SIZE_LIMIT } from '@whats-that-bird/constants';
import { useState } from 'react';

const modalQuestions = [
  {
    id: 'patterns',
    value: 'Can I describe the color patterns on the bird in detail?',
    description:
      'Color patterns play an important part of identification for most birds. ' +
      'A lack of easily distinguishable landmarks could lead to worse prediction results.',
  },
  {
    id: 'glance',
    value: "Can I quickly determine the bird's location in an image?",
    description:
      'Zoomed out images make it more difficult for the AI. Try to zoom in ' +
      'when capturing photos whenever you can.',
  },
  {
    id: 'head',
    value: 'Is the head along with the beak easily visible?',
    description:
      'Most birds have a unique head and beak shape, along with unique colorations. ' +
      'Leaving out the head leaves out less clues for the AI to work with.',
  },
];

export default function BaseDemo(props: Partial<DropzoneProps>) {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(true);

  const questions = modalQuestions.map((item) => (
    <Accordion.Item key={item.id} value={item.id}>
      <Accordion.Control
        icon={
          <IconInfoSquareFilled
            style={{ color: 'var(--mantine-color-primary-6', width: rem(20), height: rem(20) }}
          />
        }
      >
        <Text fw={500}>{item.value}</Text>
      </Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ));

  const createReadablePercentage = (num: number): string => {
    const score = parseFloat(num.toString()).toFixed(4);
    const percent = Number(score) * 100;
    return parseFloat(percent.toString()).toFixed(2);
  };

  const onDrop = (file: FileWithPath[]) => {
    const formData = new FormData();
    formData.append('file', file[0]);

    setIsLoading(true);

    const url =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.backendUrl;

    fetch(`${url}/api/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setResults(res);
        setIsLoading(false);
      });
  };

  return (
    <>
      <Modal.Root size="lg" opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header p={rem(32)} pb={0}>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body pl={rem(32)} pr={rem(32)} pb={rem(32)} pt={0}>
            <Stack align="stretch" justify="center">
              <Modal.Title fw={600} fz={rem(24)}>
                Getting the Best Results
              </Modal.Title>
              <Text>
                Our AI works best on images with exquisite detail. If you can barely make out some
                details on the bird, odds are, the model will give inaccurate results.
              </Text>
              <Text>
                A good rule of thumb is to ask yourself the following questions before uploading an
                image:
              </Text>
              <Accordion>{questions}</Accordion>
              <Title order={3}>Example</Title>
              <Group justify="center">
                <Stack>
                  <Text fw={500}>✔️ Good</Text>
                  <Image
                    radius="md"
                    maw={300}
                    src="https://www.longbeach.gov/globalassets/park/media-library/images/park-and-facilities/parks---centers---pier/el-dorado-nature-center/birds/pictures3/61_cvmain.jpg"
                    alt="A clear image of a bird. The image is in great detail."
                  />
                </Stack>
                <Stack>
                  <Text fw={500}>❌ Bad</Text>
                  <Image
                    radius="md"
                    maw={300}
                    src="https://whats-that-bird.s3.amazonaws.com/bad-bird-image.jpg"
                    alt="A zoomed out image of a flock of birds. Barely any details can be seen."
                  />
                </Stack>
              </Group>
            </Stack>
          </Modal.Body>
          <Group justify="center" p={rem(32)} bg="var(--mantine-color-gray-0)">
            <Button variant="filled" maw={rem(130)} onClick={close}>
              I Understand
            </Button>
          </Group>
        </Modal.Content>
      </Modal.Root>
      <Stack align="center" justify="center" h="100%" w="100%">
        {!results ? (
          <Dropzone
            onDrop={onDrop}
            onReject={(file) => console.log('rejected image', file)}
            maxSize={FILE_SIZE_LIMIT}
            accept={IMAGE_MIME_TYPE}
            multiple={false}
            style={{ cursor: 'pointer' }}
            loading={isLoading}
            {...props}
          >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: 'var(--mantine-color-blue-6)',
                  }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: 'var(--mantine-color-red-6)',
                  }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: 'var(--mantine-color-dimmed)',
                  }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag image here or click to select file
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attach your bird photo
                </Text>
              </div>
            </Group>
          </Dropzone>
        ) : (
          <>
            <Image src={results.url} maw={400} />
            {results.info.map(
              ({ name, confidence }: { name: string; confidence: number }, i: number) => (
                <Stack key={i} justify="center" align="center">
                  <Title order={2}>Species: {name}</Title>
                  <Text>Confidence Score: {createReadablePercentage(confidence)}%</Text>
                </Stack>
              ),
            )}
          </>
        )}
        <Button onClick={open} variant="filled">
          Show Help
        </Button>
      </Stack>
    </>
  );
}
