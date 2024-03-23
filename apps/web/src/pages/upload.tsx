import { Group, Image, Stack, Title, Text, rem } from '@mantine/core';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { FILE_SIZE_LIMIT } from '@whats-that-bird/constants';
import { useState } from 'react';

export default function BaseDemo(props: Partial<DropzoneProps>) {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    </Stack>
  );
}
