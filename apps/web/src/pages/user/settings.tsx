import { Avatar, Button, Container, Grid, rem, Stack, Text, Title } from '@mantine/core';
import SimpleHeader from '@/components/SimpleHeader';
import { SpeciesCounter, WelcomeBox } from '@/views/dashboard';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';
import { createClient as createServerClient } from '@/utils/supabase/server-props';

interface Props {
  avatar_url: string;
  username: string;
  speciesCount: number;
  totalBirds: number;
}

export default function SettingsPage({ avatar_url, username, speciesCount, totalBirds }: Props) {
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
    <>
      <SimpleHeader name={username} image={avatar_url} />
      <Container h="100%" size="xl">
        <Stack h="100%" w="100%">
          <Grid w="100%" justify="center" align="stretch">
            <Grid.Col span={8} mah={rem(300)}>
              <WelcomeBox username={username} />
            </Grid.Col>
            <Grid.Col span={4} mah={rem(300)}>
              <SpeciesCounter count={speciesCount} total={totalBirds} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
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
  const species = await supabase
    .from('user')
    .select(
      `
    user_id,
    sighting (
      user_id,
      name
    )
  `,
    )
    .eq('user_id', data.user.id);

  const url =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.backendUrl;

  const birdCount = await fetch(`${url}/api/birds/count`).then((res) => res.json());

  if (species.error) {
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
      speciesCount: species.data![0].sighting.length,
      totalBirds: birdCount.total,
    },
  };
}
