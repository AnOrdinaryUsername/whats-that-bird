import {
  Accordion,
  Button,
  Group,
  Image,
  Modal,
  ScrollArea,
  Stack,
  Title,
  Text,
  rem,
  ModalBaseProps,
} from '@mantine/core';
import { IconInfoSquareFilled } from '@tabler/icons-react';

const modalQuestions = [
  {
    id: 'patterns',
    value: "Can I describe the bird's color patterns in detail?",
    description:
      'Color patterns play an important part in the identification of most birds. ' +
      'A lack of easily distinguishable landmarks could lead to worse prediction results.',
  },
  {
    id: 'glance',
    value: 'Does the bird take up a large part of the frame?',
    description:
      'Zoomed-out images make it more difficult for the AI. Try to zoom in ' +
      'when capturing photos whenever you can.',
  },
  {
    id: 'head',
    value: "Is the bird's head, eye, and beak easily visible?",
    description:
      'Many birds have unique heads, beak shapes, and colorations. ' +
      'Leaving out the head leaves fewer clues for the AI to work with.',
  },
];

export default function TipsModal({ opened, onClose }: ModalBaseProps) {
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

  return (
    <Modal.Root
      size="lg"
      opened={opened}
      onClose={onClose}
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header p={rem(32)} pb={0}>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body pl={rem(32)} pr={rem(32)} pb={rem(32)} pt={0}>
          <Stack align="stretch" justify="center">
            <Modal.Title fw={600} fz={rem(26)} ff="Rubik">
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
            <Text>
              If you answered yes to all of these questions, then you have a great image for
              analysis!
            </Text>
            <Title order={3} fw={500}>
              Example
            </Title>
            <Group justify="center">
              <Stack>
                <Text fw={500}>✔️ Good</Text>
                <Image
                  radius="md"
                  maw={480}
                  src="https://d2jxjlx1x5gewb.cloudfront.net/a6f6a44b-390e-45dd-99f5-dde1dd891ff7.jpg"
                  alt="A clear image of a bird. The image is in great detail."
                />
              </Stack>
              <Stack>
                <Text fw={500}>❌ Bad</Text>
                <Image
                  radius="md"
                  maw={480}
                  src="https://d2jxjlx1x5gewb.cloudfront.net/bad-bird-image.jpg"
                  alt="A zoomed out image of a flock of birds. Barely any details can be seen."
                />
              </Stack>
            </Group>
          </Stack>
        </Modal.Body>
        <Group justify="center" p={rem(32)} bg="var(--mantine-color-gray-0)">
          <Button variant="filled" maw={rem(130)} onClick={onClose}>
            I Understand
          </Button>
        </Group>
      </Modal.Content>
    </Modal.Root>
  );
}
