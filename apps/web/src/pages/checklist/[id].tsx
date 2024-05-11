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
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import { LifeList, SpeciesProgress } from '@/views/checklist';
import Link from 'next/link';
import { AuthLayout } from '@/components/Layouts';
import { getAllBirdSecies, getTotalBirdSpecies } from '@/utils/supabase/birds';
import { IconPencilPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import type { Sighting } from '@/types';

interface Props {
  username: string;
  checklistUsername: string;
  avatar_url: string;
  birds: Sighting[];
  totalBirds: number;
}

export default function IdChecklistPage({
  username,
  checklistUsername,
  avatar_url,
  birds,
  totalBirds,
}: Props) {
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
    <AuthLayout
      username={username}
      avatar={avatar_url}
      pageTitle={`${checklistUsername} List`}
      pos="relative"
    >
      <Group w="100%" justify="stretch" align="stretch">
        <LifeList username={checklistUsername} count={birdCount} total={totalBirds} />
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
        {birds.length !== 0 && <Table.Tbody>{rows}</Table.Tbody>}
      </Table>
      {birds.length === 0 && (
        <Stack align="center" justify="center" mih={rem(300)}>
          <Title order={2} fw={400} fz={rem(36)} mt={rem(40)}>
            Oh no!
          </Title>
          <Stack align="center">
            <Text>This user hasn&apos;t recorded any sightings yet!</Text>
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
    </AuthLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createServerClient(context);
  const { id } = context.query;

  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return {
      redirect: {
        destination: '/log-in',
        permanent: false,
      },
    };
  }

  if (id === data.user.id) {
    return {
      redirect: {
        destination: '/user/dashboard',
        permanent: false,
      },
    };
  }

  const user = await supabase.from('user').select().eq('user_id', id);

  if (user.error || !user.data || user.data.length === 0) {
    return {
      redirect: {
        destination: '/user/dashboard',
        permanent: false,
      },
    };
  }

  const sightings = await supabase
    .from('user')
    .select('*, sighting(date, name, location, sighting_id)')
    .eq('user_id', id);
  
  const avatar = await supabase.from('user').select('avatar_url').eq('user_id', data.user.id);

  if (sightings.error) {
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }

  const birdCount = await getTotalBirdSpecies();

  return {
    props: {
      avatar_url: avatar.data![0].avatar_url,
      username: data.user.user_metadata.username,
      checklistUsername: user.data[0].username,
      birds: sightings.data[0].sighting,
      totalBirds: birdCount.total,
    },
  };
}
