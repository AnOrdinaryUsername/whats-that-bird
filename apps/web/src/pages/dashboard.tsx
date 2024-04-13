import { Avatar, Button, Container, Group, rem, Stack, Title } from '@mantine/core';

import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';
import { createClient as createServerClient } from '@/utils/supabase/server-props';

interface Props {
  avatar_url: string,
  username: string
}

export default function DasboardPage({ avatar_url, username }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error);
      }
    }

    router.push('/');
  }

  return (
    <Container h="100%" pt={rem(24)} pb={rem(24)} size="lg">
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
        <Group>
          <Avatar src={avatar_url} alt="Your profile image" />
          <Title order={1}>{username}</Title>
        </Group>
        <Title order={1} fw={400} pb={rem(20)} ta="center">
          Hello, {username || 'user'}!
        </Title>
        <Button onClick={signOut} variant="filled" mt={rem(20)}>
          Sign Out
        </Button>
      </Stack>
    </Container>
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

  return {
    props: {
      ...user.data![0],
    },
  };
}
