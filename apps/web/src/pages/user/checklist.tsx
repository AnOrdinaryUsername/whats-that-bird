import {
  Anchor,
  Table,
  Grid,
  rem,
  Title,
  Text,
  Button,
  Tooltip,
  ActionIcon,
  Stack,
  Group,
  Space,
} from '@mantine/core';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import { LifeList, SpeciesProgress } from '@/views/checklist';
import Link from 'next/link';
import { AuthLayout } from '@/components/Layouts';
import { getAllBirdSecies, getTotalBirdSpecies } from '@/utils/supabase/birds';
import { IconPencilPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import SightingModal from '@/components/SightingModal';
import { useState } from 'react';
import type { Sighting } from '@/types';

interface Props {
  username: string;
  birds: Array<Sighting>;
  totalBirds: number;
  species: Array<string>;
  avatar_url: string;
}

export default function ChecklistPage({ username, avatar_url, birds, totalBirds, species }: Props) {
  const [birdsList, setBirdsList] = useState<Sighting[]>(birds);
  const [birdCount, setBirdCount] = useState<number>(birdsList.length);
  const [opened, { open, close }] = useDisclosure(false);

  if (birdsList.length !== birdCount) {
    setBirdCount(birdsList.length);
  }

  const rows = birdsList.map(({ date, name, location, sighting_id }: Sighting) => (
    <Table.Tr key={sighting_id}>
      <Table.Td>{name}</Table.Td>
      <Table.Td>{new Date(date).toDateString()}</Table.Td>
      <Table.Td>
        <Anchor component={Link} href={`/sightings/${sighting_id}`}>
          {location}
        </Anchor>
      </Table.Td>
    </Table.Tr>
  ));

  function createReadablePercentage(num: number): string {
    const score = parseFloat(num.toString()).toFixed(4);
    const percent = Number(score) * 100;
    return parseFloat(percent.toString()).toFixed();
  }

  return (
    <AuthLayout username={username} avatar={avatar_url} pageTitle="My Life List" pos="relative">
      <Group w="100%" justify="stretch" align="stretch">
        <LifeList username={username} count={birdCount} total={totalBirds} />
        <SpeciesProgress percentage={Number(createReadablePercentage(birdCount / totalBirds))} />
      </Group>
      <Table mt={rem(36)} striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Species Name</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Location</Table.Th>
          </Table.Tr>
        </Table.Thead>
        {birdCount !== 0 && <Table.Tbody>{rows}</Table.Tbody>}
      </Table>
      {birdCount === 0 && (
        <Stack align="center" justify="center" mih={rem(300)}>
          <Title order={2} fw={400} fz={rem(36)} mt={rem(40)}>
            Oh no!
          </Title>
          <Stack gap="xs" align="center">
            <Text>You haven&apos;t recorded any sightings yet!</Text>
            <Text>Click the button below (or to the bottom right) to add a bird.</Text>
          </Stack>
          <Button
            onClick={open}
            leftSection={<IconPencilPlus style={{ width: rem(16), height: rem(16) }} />}
          >
            Create a Sighting
          </Button>
        </Stack>
      )}
      <Space h={rem(80)} />
      <SightingModal
        opened={opened}
        onClose={close}
        speciesList={species}
        onUpdate={setBirdsList}
      />
      <Tooltip
        label="Add to List"
        color="dark"
        position="left-end"
        offset={{ mainAxis: 5, crossAxis: -15 }}
      >
        <ActionIcon
          color="gray"
          variant="filled"
          radius="xl"
          aria-label="Settings"
          pos="fixed"
          size={60}
          bottom={0}
          right={0}
          mr={rem(24)}
          mb={rem(24)}
          style={{ zIndex: 1 }}
          onClick={open}
        >
          <IconPencilPlus style={{ width: '28px', height: '28px' }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </AuthLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createServerClient(context);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return {
      redirect: {
        destination: '/log-in',
        permanent: false,
      },
    };
  }

  const sightings = await supabase
    .from('user')
    .select('*, sighting(date, name, location, sighting_id)')
    .eq('user_id', data.user.id);

  const user = await supabase.from('user').select('avatar_url').eq('user_id', data.user.id);

  if (sightings.error) {
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }


  const birdCount = await getTotalBirdSpecies();
  const species = await getAllBirdSecies();

  return {
    props: {
      username: data.user.user_metadata.username,
      birds: sightings.data[0].sighting,
      totalBirds: birdCount.total,
      species: species.birds,
      avatar_url: user.data![0].avatar_url,
    },
  };
}
