import {
  rem,
  Stack,
  Group,
  Avatar,
  Text,
  Image,
  Anchor,
  Button,
  Center,
  SimpleGrid,
  Divider,
  ThemeIcon,
} from '@mantine/core';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import { AuthLayout } from '@/components/Layouts';
import Link from 'next/link';
import { IconArrowLeft, IconCalendarClock, IconFeather, IconMap2 } from '@tabler/icons-react';

interface UserInfo {
  avatar_url: string;
  username: string;
}

interface Props {
  sightingUser: UserInfo;
  loggedInUser: UserInfo;
  profileName: string;
  user_id: string;
  date: string;
  name: string;
  location: string;
  image_url: string;
  created_at: string;
}

export default function BirdSightingPage({
  sightingUser,
  loggedInUser,
  user_id,
  date,
  name,
  location,
  image_url,
  created_at,
}: Props) {
  const router = useRouter();

  let content;

  if (image_url !== null) {
    content = (
      <Stack>
        <Stack align="flex-start">
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft style={{ width: rem(16), height: rem(16) }} />}
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          <Image src={image_url} radius="md" maw={rem(800)} alt={`${name} at ${location}`} />
        </Stack>
        <Stack
          style={{ alignSelf: 'center' }}
          justify="center"
          align="center"
          maw={rem(400)}
          gap="xs"
        >
          <Group style={{ alignSelf: 'flex-start' }}>
            <Anchor component={Link} href={`/profile/id/${user_id}`}>
              <Avatar src={sightingUser.avatar_url} alt={sightingUser.username} radius="xl" />
            </Anchor>
            <div>
              <Anchor component={Link} href={`/profile/id/${user_id}`}>
                <Text size="sm">{sightingUser.username}</Text>
              </Anchor>
              <Text size="xs" c="dimmed">
                posted on {new Date(created_at).toLocaleDateString()}
              </Text>
            </div>
          </Group>
          <Divider my="md" w="100%" />
          <SimpleGrid cols={2}>
            <Group gap="sm" maw={rem(120)}>
              <ThemeIcon size={24} variant="light" color="gray">
                <IconCalendarClock style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
              <Text fz="lg">Spotted:</Text>
            </Group>
            <Text>{new Date(date).toDateString()}</Text>

            <Group gap="sm" maw={rem(120)}>
              <ThemeIcon size={24} variant="light" color="gray">
                <IconFeather style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
              <Text fz="lg">Species:</Text>
            </Group>
            <Anchor href={`https://www.allaboutbirds.org/guide/${name.replaceAll(' ', '_')}`}>
              {name}
            </Anchor>

            <Group gap="sm" maw={rem(120)}>
              <ThemeIcon size={24} variant="light" color="gray">
                <IconMap2 style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
              <Text fz="lg">Location:</Text>
            </Group>
            <Anchor
              href={`https://www.google.com/maps/search/?api=1&query=${location.replaceAll(' ', '+')}`}
            >
              {location}
            </Anchor>
          </SimpleGrid>
        </Stack>
      </Stack>
    );
  } else {
    content = (
      <>
        <Stack align="center">
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft style={{ width: rem(16), height: rem(16) }} />}
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </Stack>
        <Stack justify="center" align="center" maw={rem(400)} gap="xs">
          <Group style={{ alignSelf: 'flex-start' }}>
            <Anchor component={Link} href={`/profile/id/${user_id}`}>
              <Avatar src={sightingUser.avatar_url} alt={sightingUser.username} radius="xl" />
            </Anchor>
            <div>
              <Anchor component={Link} href={`/profile/id/${user_id}`}>
                <Text size="sm">{sightingUser.username}</Text>
              </Anchor>
              <Text size="xs" c="dimmed">
                posted on {new Date(date).toLocaleDateString()}
              </Text>
            </div>
          </Group>
          <Divider my="md" w="100%" />

          <SimpleGrid cols={2}>
            <Group gap="sm" maw={rem(120)}>
              <ThemeIcon size={24} variant="light" color="gray">
                <IconCalendarClock style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
              <Text fz="lg">Spotted:</Text>
            </Group>
            <Text>{new Date(date).toDateString()}</Text>

            <Group gap="sm" maw={rem(120)}>
              <ThemeIcon size={24} variant="light" color="gray">
                <IconFeather style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
              <Text fz="lg">Species:</Text>
            </Group>
            <Anchor href={`https://www.allaboutbirds.org/guide/${name.replaceAll(' ', '_')}`}>
              {name}
            </Anchor>
            <Group gap="sm" maw={rem(120)}>
              <ThemeIcon size={24} variant="light" color="gray">
                <IconMap2 style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
              <Text fz="lg">Location:</Text>
            </Group>
            <Anchor
              href={`https://www.google.com/maps/search/?api=1&query=${location.replaceAll(' ', '+')}`}
            >
              {location}
            </Anchor>
          </SimpleGrid>
        </Stack>
      </>
    );
  }

  return (
    <AuthLayout
      username={loggedInUser.username}
      avatar={loggedInUser.avatar_url}
      pageTitle={'Sighting'}
    >
      <Stack align="center">{content}</Stack>
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

  const sighting = await supabase.from('sighting').select().eq('sighting_id', id).limit(1).single();

  if (sighting.error || !sighting.data || sighting.data.length === 0) {
    return {
      redirect: {
        destination: '/user/dashboard',
        permanent: false,
      },
    };
  }

  const sightingUser = await supabase
    .from('user')
    .select()
    .eq('user_id', sighting.data.user_id)
    .limit(1)
    .single();

  const user = await supabase
    .from('user')
    .select('avatar_url, username')
    .eq('user_id', data.user.id)
    .limit(1)
    .single();

  if (sightingUser.error || user.error) {
    return {
      redirect: {
        destination: '/user/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {
      sightingUser: { ...sightingUser.data },
      loggedInUser: { ...user.data },
      user_id: sightingUser.data.user_id,
      date: sighting.data.date,
      name: sighting.data.name,
      location: sighting.data.location,
      image_url: sighting.data.image_url,
      created_at: sighting.data.created_at,
    },
  };
}
