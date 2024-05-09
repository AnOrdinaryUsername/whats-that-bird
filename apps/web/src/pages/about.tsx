import { GenericLayout } from '@/components/Layouts';
import Header from '@/components/Header';
import { Anchor, Group, Image, Stack, Text, Title, rem } from '@mantine/core';

export default function AboutPage() {
  return (
    <GenericLayout size="lg" bg="#fef9ff">
      <Header />
      <Stack w="100%" gap="xl" justify="center" align="center" mb={rem(96)}>
        <Stack component="section" align="center" maw={rem(800)}>
          <Stack align="center" mb={rem(48)}>
            <Title order={1} fw={500} fz={rem(48)} ta="center">
              We're Helping Others Get Into the World of Birding
            </Title>
            <Text fz={rem(14)} ta="center">
              Learning and identifying the many birds around us can be tough, but it doesn't have to
              be so difficult.
            </Text>
          </Stack>
          <Image
            src="https://d2jxjlx1x5gewb.cloudfront.net/birdge.jpg"
            alt="The beauty of birding"
            maw={rem(800)}
          />
        </Stack>
      </Stack>
      <Stack w="100%" mih={rem(600)} justify="center" align="center">
        <Group justify="center" gap="xl">
          <Stack component="section" maw={rem(500)}>
            <Title order={2} fz={rem(40)} fw={400}>
              Leveraging the Power of Machine Learning
            </Title>
            <Text fz={rem(14)} mt={rem(12)}>
              To know what bird species are present in an image, we built a custom-trained model
              based on the You Only Look Once (YOLO) model from{' '}
              <Anchor href="https://docs.ultralytics.com/" target="_blank">
                Ultralytics
              </Anchor>
              . Performant, accurate, and reliable, our model gives great results in seconds.
            </Text>
          </Stack>
          <Image
            src="https://d2jxjlx1x5gewb.cloudfront.net/8b257a9f-361b-4639-91da-7f78965409b2.png"
            alt="Snowy Egret identified by AI"
            maw={rem(500)}
          />
        </Group>
      </Stack>
    </GenericLayout>
  );
}
