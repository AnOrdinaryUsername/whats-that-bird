import { Grid, rem, Stack } from '@mantine/core';
import { SpeciesCounter, WelcomeBox } from '@/views/dashboard';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import { AuthLayout } from '@/components/Layouts';
import { getTotalBirdSpecies } from '@/utils/supabase/birds';

interface Props {
  avatar_url: string;
  username: string;
  speciesCount: number;
  totalBirds: number;
}

export default function DasboardPage({ avatar_url, username, speciesCount, totalBirds }: Props) {
  const router = useRouter();
  const supabase = createClient();

  return (
    <AuthLayout username={username} avatar={null} pageTitle="Dashboard">
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

  const species = await supabase
    .from('sighting')
    .select('*', { count: 'exact' })
    .eq('user_id', data.user.id);

  const birdCount = await getTotalBirdSpecies();

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
      speciesCount: species.count,
      totalBirds: birdCount.total,
    },
  };
}
