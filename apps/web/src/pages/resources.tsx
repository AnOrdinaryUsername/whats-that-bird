import { GenericLayout } from '@/components/Layouts';
import Header from '@/components/Header';
import { Anchor, List, Stack, Text, Title, rem } from '@mantine/core';
import { ThemeIcon } from '@mantine/core';
import { IconArrowNarrowRight } from '@tabler/icons-react';

const sites = [
  { link: 'https://www.allaboutbirds.org/guide/', label: 'All About Birds' },
  { link: 'https://ebird.org/hotspots', label: 'eBird Hotspots' },
  { link: 'https://www.audubon.org/bird-guide', label: 'Audubon' },
];

const apps = [
  { link: 'https://merlin.allaboutbirds.org/', label: 'Merlin Bird ID (free)' },
  { link: 'https://www.audubon.org/app', label: 'Audubon Bird Guide (free)' },
  {
    link: 'https://www.sibleyguides.com/product/sibley-birds-v2-app/',
    label: 'Sibley Birds v2 ($19.99)',
  },
];

const books = [
  {
    link: 'https://www.sibleyguides.com/product/sibley-field-guide-birds-western-north-america-second-edition/',
    label: 'The Sibley Field Guide to Birds of Western North America: Second Edition',
  },
  {
    link: 'https://www.amazon.com/Birds-Southern-California-Kimball-Garrett/dp/0964081083',
    label: 'Birds of Southern California',
  },
];

const places = [
  {
    link: 'https://maps.app.goo.gl/siM4qSVEmoFsMUG18',
    label: 'Bolsa Chica Ecological Reserve (Huntington Beach, CA)',
    notes:
      'Has a nice educational interpretive center detailing the history of the area and the wildlife.',
  },
  {
    link: 'https://maps.app.goo.gl/4bxGmgP5UvtdRFMS9',
    label: 'IRWD San Joaquin Marsh & Wildlife Sanctuary (Irvine, CA)',
    notes:
      'Easy walk as the trail is very flat. Also an extremely popular spot among birders and even has a gift shop for supporting the local Audobon Society.',
  },
  {
    link: 'https://maps.app.goo.gl/TqbVnppvrA2ahSHW6',
    label: 'San Jacinto Wildlife Area (Lakeview, CA)',
    notes:
      'There are so many birds in this area. Bring a nice pair of binoculars, a hat, and sunscreen for optimal viewing.',
  },
  {
    link: 'https://maps.app.goo.gl/KA5WWCiNHYv7TAVw5',
    label: 'Upper Newport Bay Nature Preserve (Newport Beach, CA)',
    notes:
      'Similar to Bolsa Chica, with a nice interpretive center and a gorgeous view at the top.',
  },
];

export default function ResourcesPage() {
  const websites = sites.map(({ link, label }) => (
    <List.Item>
      <Anchor href={link} target="_blank">
        {label}
      </Anchor>
    </List.Item>
  ));

  const birdApps = apps.map(({ link, label }) => (
    <List.Item>
      <Anchor href={link} target="_blank">
        {label}
      </Anchor>
    </List.Item>
  ));

  const recommendedReadings = books.map(({ link, label }) => (
    <List.Item>
      <Anchor href={link} target="_blank">
        {label}
      </Anchor>
    </List.Item>
  ));

  const birdingSpots = places.map(({ link, label, notes }) => (
    <List.Item>
      <Anchor href={link} target="_blank">
        {label}
      </Anchor>{' '}
      - {notes}
    </List.Item>
  ));

  return (
    <GenericLayout size="lg" bg="#EBFCFF">
      <Header />
      <Stack w="100%" gap="xl" mb={rem(96)} pt={rem(40)}>
        <Stack component="section" maw={rem(800)}>
          <Stack mb={rem(32)}>
            <Title order={1} fw={500} fz={rem(48)}>
              Resources
            </Title>
            <Text fz={rem(20)}>
              Here are some helpful links that might help you with your birding journey.
            </Text>
          </Stack>
          <Stack gap="lg">
            <Stack gap='xs'>
              <Title order={2} fw={400} fz={rem(24)}>
                Related Websites
              </Title>
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
                {websites}
              </List>
            </Stack>
            <Stack gap='xs'>
            <Title order={2} fw={400} fz={rem(24)}>
              Mobile Apps
            </Title>
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
                {birdApps}
              </List>
            </Stack>
            <Stack gap='xs'>
              <Title order={2} fw={400} fz={rem(24)}>
                Recommended Readings
              </Title>

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
                {recommendedReadings}
              </List>
            </Stack>
            <Stack gap='xs'>
              <Title order={2} fw={400} fz={rem(24)}>
                Places to Visit in California for Bird Viewing
              </Title>
              <List
                withPadding
                listStyleType="disc"
                spacing={12}
                icon={
                  <ThemeIcon size={24} variant="light" color="gray">
                    <IconArrowNarrowRight style={{ width: rem(16), height: rem(16) }} />
                  </ThemeIcon>
                }
              >
                {birdingSpots}
              </List>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </GenericLayout>
  );
}
