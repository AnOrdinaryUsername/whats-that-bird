import { Button, Group, Image, Stack, Title, Text, Container, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DropzoneProps, FileWithPath } from '@mantine/dropzone';
import { useState } from 'react';
import TipsModal from '@/components/TipsModal';
import FileDropzone from '@/components/FileDropzone';
import Header from '@/components/Header';
import { calculateSizeAdjustValues } from 'next/dist/server/font-utils';

export default function BaseDemo(props: Partial<DropzoneProps>) {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(true);

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
    <Container size="lg" bg="inherit" pb={rem(24)}>
      <Header />
      <TipsModal opened={opened} onClose={close} />

      <Stack
        align="center"
        justify="center"
        h="100%"
        w="100%"
        bg="var(--mantine-color-white)"
        p={rem(75)}
        pl={rem(25)}
        pr={rem(25)}
        style={{
          borderRadius: rem(16),
          border: '2px solid light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-4))',
        }}
      >
        <Title order={1} pb={rem(20)} ta="center">
          Upload Your Bird Images
        </Title>
        {!results ? (
          <FileDropzone loading={isLoading} onDrop={onDrop} />
        ) : (
          <>
            <Image src={results.url} maw={400} />
            {results.info.map(
              ({ name, confidence }: { name: string; confidence: number }, i: number) => (
                <Stack key={i} justify="center" align="center">
                  <Title order={2} ta="center">
                    Species: {name}
                  </Title>
                  <Text>Confidence Score: {createReadablePercentage(confidence)}%</Text>
                </Stack>
              ),
            )}
          </>
        )}
        <Button onClick={open} variant="filled" mt={rem(20)}>
          Show Help
        </Button>
      </Stack>
    </Container>
  );
}
