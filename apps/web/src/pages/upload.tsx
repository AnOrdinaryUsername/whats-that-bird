import { Group, Stack, Text, rem } from '@mantine/core';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { FILE_SIZE_LIMIT } from '@whats-that-bird/constants';

export default function BaseDemo(props: Partial<DropzoneProps>) {
  const onDrop = (file: FileWithPath[]) => {
    const formData = new FormData();
    formData.append('file', file[0]);

    const url =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.backendUrl;

    fetch(`${url}/api/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  return (
    <Stack align="center" justify="center" style={{ height: '100%' }}>
      <Dropzone
        onDrop={onDrop}
        onReject={(file) => console.log('rejected image', file)}
        maxSize={FILE_SIZE_LIMIT}
        accept={IMAGE_MIME_TYPE}
        multiple={false}
        style={{ cursor: 'pointer' }}
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
    </Stack>
  );
}
