import { Group, Title, Text, Stack, Divider, NativeSelect, Anchor, Checkbox } from '@mantine/core';
import type { GetServerSidePropsContext } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import { AuthLayout } from '@/components/Layouts';
import { useState } from 'react';
import React from 'react';
import Link from 'next/link';
import type { Sighting } from '@/types';
import ImageCard from '@/components/ImageCard';

interface Props {
  avatar_url: string;
  username: string;
  sightings: Array<Sighting>;
}

export default function SightingsPage({ avatar_url, username, sightings }: Props) {
  const [userSightings, setUserSightings] = useState<Sighting[]>(sightings);
  const [hasImages, setHasImages] = useState(false);

  function sortSightings(event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;

    const copy = [...userSightings];

    if (value === 'Latest Upload') {
      const sortedArray = copy.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
      setUserSightings(sortedArray);
    } else if (value === 'Date: Oldest') {
      const sortedArray = copy.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
      setUserSightings(sortedArray);
    } else if (value === 'Date: Recent') {
      const sortedArray = copy.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
      setUserSightings(sortedArray);
    }
  }

  return (
    <AuthLayout username={username} avatar={avatar_url} pageTitle="Community Sightings">
      <Stack h="100%" w="100%" gap="xs">
        <Title order={1} fw={500}>
          Sightings
        </Title>
        <Divider w="100%" my="md" />
        <Group justify="space-between" align="baseline">
          <Text component="span" size="xs">
            {sightings.length} reported
          </Text>
          <Group>
            <Checkbox
              checked={hasImages}
              label="Show Image Cards"
              onChange={(event) => setHasImages(event.currentTarget.checked)}
            />
            <NativeSelect
              data={['Latest Upload', 'Date: Oldest', 'Date: Recent']}
              onChange={sortSightings}
            />
          </Group>
        </Group>
        <Group w="100%" justify="space-between">
          {!hasImages &&
            userSightings.map(({ name, date, sighting_id }: Sighting) => (
              <Stack key={sighting_id}>
                <Anchor component={Link} href={`/sightings/${sighting_id}`}>
                  <Text>{name}</Text>
                  <Text>{new Date(date).toLocaleDateString()}</Text>
                </Anchor>
              </Stack>
            ))}
          {hasImages &&
            userSightings.map((props: Sighting) => (
              <ImageCard key={props.sighting_id} {...props} />
            ))}
        </Group>
      </Stack>
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

  const user = await supabase.from('user').select().eq('user_id', data.user.id);

  const sightings = await supabase
    .from('sighting')
    .select()
    .order('created_at', { ascending: false });

  if (sightings.error) {
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...user.data![0],
      sightings: sightings.data,
    },
  };
}
