import { Group, Text, rem } from '@mantine/core';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { FILE_SIZE_LIMIT } from '@whats-that-bird/constants';
import classes from './FileDropzone.module.css';

export default function FileDropzone({ onDrop, loading, ...props }: DropzoneProps) {
  return (
    <Dropzone
      onDrop={onDrop}
      onReject={(file) => console.log('rejected image', file)}
      maxSize={FILE_SIZE_LIMIT}
      accept={IMAGE_MIME_TYPE}
      multiple={false}
      style={{ cursor: 'pointer' }}
      loading={loading}
      className={classes.dropzone}
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

        <div className={classes.text}>
          <Text size="xl" inline>
            Drag image here or click to select file
          </Text>
          <Text size="sm" c="dimmed" inline mt={8}>
            Attach your bird photo
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
