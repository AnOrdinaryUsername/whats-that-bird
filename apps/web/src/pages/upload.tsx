import {
  Button,
  Divider,
  Group,
  Image,
  Stack,
  Title,
  Text,
  rem,
  Anchor,
  Mark,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { FileWithPath } from '@mantine/dropzone';
import { useState } from 'react';
import { modals } from '@mantine/modals';
import TipsModal from '@/components/TipsModal';
import FileDropzone from '@/components/FileDropzone';
import Header from '@/components/Header';
import { GenericLayout } from '@/components/Layouts';
import type { GetServerSidePropsContext } from 'next';


interface Props {
  ipAddress: string;
}

export default function UploadPage({ ipAddress }: Props) {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(true);

  let birdInfo;

  if (results) {
    birdInfo = results.info.map(
      ({ name, confidence }: { name: string; confidence: number }, i: number) => (
        <Stack key={i} justify="flex-start" align="flex-start" maw={rem(500)}>
          <Stack gap={rem(0)}>
            <Title component="span" ff="Rubik" fz={rem(16)} fw={300}>
              SPECIES
            </Title>
            <Title order={2} ta="left" fz={rem(36)}>
              {name}
            </Title>
          </Stack>
          <Text>
            <Mark color="var(--mantine-color-primary-1)">
              Our AI is {createReadablePercentage(confidence)}% confident about this result.
            </Mark>
          </Text>
          <Text>
            To learn more about this particular bird, visit the{' '}
            <Anchor href={`https://www.allaboutbirds.org/guide/${name.replaceAll(' ', '_')}`}>
              {name}
            </Anchor>{' '}
            page from the Cornell Lab of Ornithology.
          </Text>
        </Stack>
      ),
    );
  }

  function showPreview(files: FileWithPath[]): void {
    const imageUrl = URL.createObjectURL(files[0]);

    modals.openConfirmModal({
      centered: true,
      title: 'Image Preview',
      children: <Image src={imageUrl} alt="" onLoad={() => URL.revokeObjectURL(imageUrl)} />,
      labels: { confirm: 'Upload Photo', cancel: 'Go Back' },
      cancelProps: { variant: 'light' },
      onConfirm: () => uploadPhoto(files),
    });
  }

  function createReadablePercentage(num: number): string {
    const score = parseFloat(num.toString()).toFixed(4);
    const percent = Number(score) * 100;
    return parseFloat(percent.toString()).toFixed();
  }

  function uploadPhoto(files: FileWithPath[]): void {
    const formData = new FormData();
    formData.append('file', files[0]);
    setIsLoading(true);

    const url =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.backendUrl;

    fetch(`${url}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'x-forwarded-for': ipAddress
      }
    })
      .then((res) => {
        if (res.status === 429) {
          throw new Error(
            "You've exceeded the max upload limit of 10 images. You can upload again in 24 hours.",
          );
        } else if (!res.ok) {
          throw new Error(
            'There seems to be a problem with the server at the moment. Please try again later.',
          );
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setResults(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        notifications.show({
          withCloseButton: true,
          autoClose: 30000,
          title: 'Oh no!',
          message: error.message,
          color: 'red',
          loading: false,
        });
      });
  }

  return (
    <GenericLayout size="lg" bg="#dce4f5">
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
        {!results ? (
          <>
            <Title order={1} fw={400} pb={rem(20)} ta="center">
              Upload a bird photo for identification
            </Title>
            <FileDropzone loading={isLoading} onDrop={showPreview} />
            <Button onClick={open} variant="filled" mt={rem(20)}>
              Show Help
            </Button>
          </>
        ) : (
          <>
            <Title order={1} fw={400} pb={rem(20)} ta="left">
              Results
            </Title>
            <Group align="center" justify="center">
              <Image alt="" src={results.url} />
              <Divider my="md" />
              <Stack gap={rem(36)}>{birdInfo}</Stack>
            </Group>
            <Button onClick={() => setResults(null)} variant="filled" mt={rem(20)}>
              Upload Another Image
            </Button>
          </>
        )}
      </Stack>
    </GenericLayout>
  );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  return {
    props: {
      ipAddress
    },
  };
}