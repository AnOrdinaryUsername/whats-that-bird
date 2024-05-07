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
  Kbd,
  TextInput,
  SimpleGrid,
  FileInput,
  List,
  ThemeIcon,
  Center,
  ActionIcon,
  Tooltip,
  LoadingOverlay,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { FileWithPath } from '@mantine/dropzone';
import {
  IconArrowNarrowRight,
  IconCamera,
  IconCrop,
  IconFeather,
  IconFileAnalytics,
  IconPhoto,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { useState, useRef } from 'react';
import { modals } from '@mantine/modals';
import TipsModal from '@/components/TipsModal';
import FileDropzone from '@/components/FileDropzone';
import Header from '@/components/Header';
import { GenericLayout } from '@/components/Layouts';
import ImageEditor from '@/components/ImageEditor';

export default function UploadPage() {
  const [results, setResults] = useState<any>(null);
  const [imageURL, setImageURL] = useState<string>('');

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imageBlob, setImageBlob] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [opened, { open, close }] = useDisclosure(true);

  const inputRef = useRef<HTMLInputElement | null>(null);

  let birdInfo;

  if (results) {
    if (results.info.length === 0) {
      birdInfo = (
        <Stack justify="flex-start" align="flex-start" maw={rem(500)}>
          <Title order={2} ta="left" fz={rem(36)}>
            No Species Found
          </Title>
          <Text>
            <Mark color="var(--mantine-color-primary-1)">
              Our AI couldn&apos;t detect any birds in the image.
            </Mark>
          </Text>
          <Text>This could be caused by any of the following:</Text>
          <List listStyleType="disc" spacing={8}>
            <List.Item
              styles={{ itemWrapper: { alignItems: 'flex-start' } }}
              icon={
                <ThemeIcon size={24} radius="xl" variant="light" color="gray">
                  <IconFeather style={{ width: rem(16), height: rem(16) }} />
                </ThemeIcon>
              }
            >
              <Text fw={600}>The bird is</Text>
              <List
                withPadding
                listStyleType="disc"
                spacing={4}
                icon={
                  <ThemeIcon size={24} variant="light" color="gray">
                    <IconArrowNarrowRight style={{ width: rem(16), height: rem(16) }} />
                  </ThemeIcon>
                }
              >
                <List.Item mt={4}>not naturally seen in California</List.Item>
                <List.Item>a domesticated species</List.Item>
                <List.Item>not taking up a large part of the frame</List.Item>
              </List>
            </List.Item>
            <List.Item
              styles={{ itemWrapper: { alignItems: 'flex-start' } }}
              icon={
                <ThemeIcon size={24} radius="xl" variant="light" color="gray">
                  <IconPhoto style={{ width: rem(16), height: rem(16) }} />
                </ThemeIcon>
              }
            >
              <Text fw={600}>Image is</Text>
              <List
                withPadding
                listStyleType="disc"
                spacing={4}
                icon={
                  <ThemeIcon size={24} variant="light" color="gray">
                    <IconArrowNarrowRight style={{ width: rem(16), height: rem(16) }} />
                  </ThemeIcon>
                }
              >
                <List.Item mt={4}>of low resolution</List.Item>
                <List.Item>overexposed or undexposed</List.Item>
                <List.Item>lacking in detail or clarity</List.Item>
              </List>
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon size={24} radius="xl" variant="light" color="gray">
                  <IconFileAnalytics style={{ width: rem(16), height: rem(16) }} />
                </ThemeIcon>
              }
            >
              <Text fw={600}>Data quality issue on our end</Text>
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon size={24} radius="xl" variant="light" color="gray">
                  <IconX style={{ width: rem(16), height: rem(16) }} />
                </ThemeIcon>
              }
            >
              <Text fw={600}>There are no birds in the image</Text>
            </List.Item>
          </List>
        </Stack>
      );
    } else {
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
  }

  function showPreview(files: FileWithPath[], hideEditButton = false): void {
    const imageUrl = URL.createObjectURL(files[0]);
    setImageBlob(imageUrl);

    modals.openConfirmModal({
      centered: true,
      title: 'Image Preview',
      children: (
        <Center pos="relative">
          <Image src={imageUrl} alt="" />
          {!hideEditButton && (
            <Tooltip
              label="Edit Image"
              color="dark"
              position="right-end"
              offset={{ mainAxis: 5, crossAxis: -3 }}
            >
              <ActionIcon
                color="gray"
                variant="filled"
                radius="xl"
                aria-label="Settings"
                pos="absolute"
                size={36}
                bottom={0}
                left={0}
                ml={rem(12)}
                mb={rem(12)}
                style={{ zIndex: 1 }}
                onClick={changeToEditor}
              >
                <IconCrop style={{ width: 'rem(24)', height: 'rem(24)' }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          )}
        </Center>
      ),
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

  function createReadableTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (!hours) {
      if (minutes === 1) {
        return `${minutes} minute`;
      }

      return `${minutes} minutes`;
    }

    if (hours === 1) {
      return `${hours} hour`;
    }

    return `${hours} hours`;
  }

  function uploadPhoto(files: FileWithPath[]): void {
    const formData = new FormData();
    formData.append('file', files[0]);
    window.scrollTo(0, 0);
    setIsLoading(true);

    const url =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.backendUrl;

    fetch(`${url}/api/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (res.status === 429) {
          const limitReset = parseInt(res.headers.get('X-Ratelimit-Reset') as string);
          const maxUpload = res.headers.get('X-Ratelimit-Limit');
          const timeLeft = createReadableTime(limitReset);

          throw new Error(
            `You've exceeded the max upload limit of ${maxUpload} images. ` +
              `You can upload again in ${timeLeft}.`,
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

        if (imageBlob) {
          URL.revokeObjectURL(imageBlob);
          setImageBlob(null);
        }

        setResults(res);
        setIsEditing(false);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        notifications.show({
          withCloseButton: true,
          autoClose: 30000,
          title: 'Upload Error',
          message: error.message,
          color: 'red',
          loading: false,
        });
      });
  }

  function uploadImageURL(url: string) {
    if (url.length === 0) {
      notifications.show({
        withCloseButton: true,
        autoClose: 30000,
        title: 'URL Error',
        message: 'No URL was entered.',
        color: 'red',
        loading: false,
      });
      return;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('The server hosting the image returned an invalid response.');
        }
        return res.blob();
      })
      .then((blob) => {
        const filename = new URL(url).pathname.split('/').pop()!;
        const imgBlob = new File([blob], filename, { type: blob.type });
        showPreview([imgBlob]);
      })
      .catch((error) => {
        notifications.show({
          withCloseButton: true,
          autoClose: 30000,
          title: 'URL Error',
          message: error.message,
          color: 'red',
          loading: false,
        });
      });
  }

  function showTestImage() {
    const testImage = 'https://upload.wikimedia.org/wikipedia/commons/a/aa/California_quail.jpg';
    setImageURL(testImage);
    uploadImageURL(testImage);
  }

  function pasteImage(event: React.ClipboardEvent<HTMLDivElement>) {
    // Prevents paste error notification from popping up when
    // pasting in the url input.
    if (event.target === inputRef.current) {
      return;
    }

    const { clipboardData } = event;

    if (clipboardData) {
      if (!(clipboardData.files.length > 0)) {
        notifications.show({
          withCloseButton: true,
          autoClose: 30000,
          title: 'Paste Error',
          message: 'The pasted content is not an image.',
          color: 'red',
          loading: false,
        });
        return;
      }

      showPreview([clipboardData.files[0]]);
    }
  }

  function changeToEditor() {
    modals.closeAll();
    setIsEditing(true);
  }

  return (
    <GenericLayout
      pageTitle="Upload Your Bird"
      size="lg"
      bg="#dce4f5"
      onPaste={(event) => pasteImage(event)}
    >
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
        {!results && !isEditing && (
          <>
            <Title order={1} fw={400} pb={rem(20)} ta="center">
              Upload a bird photo for identification
            </Title>
            <FileDropzone loading={isLoading} onDrop={showPreview} />
            <Divider
              my="md"
              label="Or enter a URL"
              labelPosition="center"
              mb={0}
              maw={rem(660)}
              w="100%"
            />
            <Stack align="flex-start" maw={rem(650)} mt={rem(16)} w="100%" gap={rem(2)}>
              <Group align="end" w="100%">
                <TextInput
                  ref={inputRef}
                  aria-label="Image URL"
                  placeholder="https://website.com/bird_image.jpg"
                  value={imageURL}
                  onChange={(event) => setImageURL(event.currentTarget.value)}
                  styles={{
                    root: { flexGrow: 1 },
                    input: {
                      border: '1.5px var(--mantine-color-gray-2) solid',
                      background: 'var(--mantine-color-gray-0)',
                    },
                  }}
                  leftSection={<IconPhoto style={{ width: rem(16), height: rem(16) }} />}
                />
                <Button
                  variant="filled"
                  bg="var(--mantine-color-gray-4)"
                  leftSection={<IconUpload style={{ width: rem(16), height: rem(16) }} />}
                  onClick={() => uploadImageURL(imageURL)}
                  visibleFrom="sm"
                >
                  Upload Image
                </Button>
                <Button
                  variant="filled"
                  bg="var(--mantine-color-gray-4)"
                  leftSection={<IconUpload style={{ width: rem(16), height: rem(16) }} />}
                  onClick={() => uploadImageURL(imageURL)}
                  w="100%"
                  hiddenFrom="sm"
                >
                  Upload Image
                </Button>
              </Group>
              <Button
                size="xs"
                variant="transparent"
                pl={0}
                color="gray"
                td="underline"
                onClick={showTestImage}
              >
                Example Image
              </Button>
            </Stack>
            <Divider
              my="md"
              label="Or take a photo"
              labelPosition="center"
              mb={0}
              maw={rem(660)}
              w="100%"
            />
            <FileInput
              onChange={(file) => file !== null && showPreview([file])}
              accept="image/*"
              mt={rem(8)}
              clearable
              leftSection={<IconCamera style={{ width: rem(16), height: rem(16) }} />}
              capture="environment"
              styles={{
                input: {
                  border: '1.5px var(--mantine-color-gray-2) solid',
                  background: 'var(--mantine-color-gray-0)',
                },
              }}
              aria-label="Capture an image with your camera"
              placeholder="Capture an image with your camera"
            />
            <Divider
              my="md"
              label="Or paste from Clipboard"
              labelPosition="center"
              mb={0}
              maw={rem(660)}
              w="100%"
            />
            <SimpleGrid cols={2} mt={rem(8)}>
              <div>On Windows:</div>
              <div>
                <Kbd>Ctrl</Kbd> + <Kbd>V</Kbd>
              </div>
              <div>On Mac:</div>
              <div>
                <Kbd>⌘ Command</Kbd> + <Kbd>V</Kbd>
              </div>
            </SimpleGrid>
            <Button onClick={open} variant="subtle" mt={rem(20)} td="underline">
              How to Get the Best Results
            </Button>
          </>
        )}
        {!results && isEditing && (
          <Stack maw={rem(600)} w="100%">
            <Stack gap={12}>
              <Title order={1} fw={500} ta="left">
                Edit Image
              </Title>
              <Text pb={rem(20)}>
                Crop the image to ensure the bird takes up a large part of the frame.
              </Text>
            </Stack>
            <LoadingOverlay visible={isLoading} />
            <ImageEditor editState={setIsEditing} src={imageBlob!} onUpload={showPreview} />
          </Stack>
        )}
        {results && (
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
