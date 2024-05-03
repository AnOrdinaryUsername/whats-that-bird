import { Button, Container, Grid, rem, Stack } from '@mantine/core';
import SimpleHeader from '@/components/SimpleHeader';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import { SpeciesProgress } from '@/views/checklist';
import { WelcomeBox } from '@/views/dashboard';

interface Props {
  avatar_url: string;
  username: string;
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
    <>
      <SimpleHeader name={username} image={null} />
      <Container h="100%" size="xl">
        <Stack h="100%" w="100%">
          <Grid w="100%" justify="center" align="stretch">
            <Grid.Col span={8} mah={rem(300)}>
              <WelcomeBox username={username} />
            </Grid.Col>
            <Grid.Col span={4} mah={rem(300)}>
              <SpeciesProgress percentage={69} />
            </Grid.Col>
          </Grid>
          <Button onClick={signOut} variant="filled" mt={rem(20)}>
            Sign Out
          </Button>
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

  return {
    props: {
      ...user.data![0],
    },
  };
}
