import { rem, Button, Group, Stack } from '@mantine/core';
import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import { Cropper, CropperRef } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css';
import classes from './ImageEditor.module.css';
import { IconArrowLeft } from '@tabler/icons-react';
import { FileWithPath } from '@mantine/dropzone';


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
        return new File([blob], filename, { type: blob.type })
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
        <Button className={classes.button} onClick={uploadCroppedImage}>Upload Image</Button>
      </Group>
    </>
  );
}
