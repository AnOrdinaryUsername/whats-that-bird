import { rem, Button, Group, Text } from '@mantine/core';
import React, { useState, useRef } from 'react';
import { Cropper, CropperRef } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css';
import classes from './ImageEditor.module.css';
import { IconArrowLeft, IconRefresh, IconUpload } from '@tabler/icons-react';
import { FileWithPath } from '@mantine/dropzone';
import { modals } from '@mantine/modals';

interface Props {
  src: string;
  onUpload: (files: FileWithPath[], hideEditButton: boolean) => void;
  editState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImageEditor({ src, onUpload, editState }: Props) {
  const [image, _] = useState<string>(src);
  const [croppedImage, setCroppedImage] = useState<string>();
  const cropperRef = useRef<CropperRef>(null);

  function cropImage() {
    if (cropperRef.current) {
      setCroppedImage(cropperRef.current.getCanvas()?.toDataURL());
    }
  }

  async function uploadCroppedImage() {
    const url = croppedImage ?? src;
    const file = await fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const filename = new URL(url).pathname.split('/').pop()!;
        return new File([blob], filename, { type: blob.type });
      });

    onUpload([file], true);
  }

  function goBackToUpload() {
    if (croppedImage) {
      URL.revokeObjectURL(src);
      URL.revokeObjectURL(croppedImage);
    }

    editState(false);
  }

  function resetCrop() {
    if (cropperRef.current) {
      cropperRef.current.reset();
      setCroppedImage(image);
    }
  }

  function confirmReset() {
    modals.openConfirmModal({
      centered: true,
      title: 'Please confirm your action',
      children: <Text>Reset image to its original state?</Text>,
      labels: { confirm: 'Reset', cancel: 'Cancel' },
      cancelProps: { variant: 'light' },
      confirmProps: { variant: 'filled', color: 'red' },
      onConfirm: () => resetCrop(),
    });
  }

  return (
    <>
      <Cropper
        src={image}
        className={classes.cropper}
        onInteractionEnd={cropImage}
        ref={cropperRef}
      />
      <Group justify="space-between" className={classes['button-container']}>
        <Button
          variant="subtle"
          className={classes.button}
          leftSection={<IconArrowLeft style={{ width: rem(16), height: rem(16) }} />}
          onClick={goBackToUpload}
        >
          Go Back
        </Button>
        <Group className={classes['button-container']}>
          <Button
            variant="light"
            color="red"
            className={classes.button}
            leftSection={<IconRefresh style={{ width: rem(16), height: rem(16) }} />}
            onClick={confirmReset}
          >
            Reset
          </Button>
          <Button
            className={classes.button}
            onClick={uploadCroppedImage}
            leftSection={<IconUpload style={{ width: rem(16), height: rem(16) }} />}
          >
            Upload Image
          </Button>
        </Group>
      </Group>
    </>
  );
}
