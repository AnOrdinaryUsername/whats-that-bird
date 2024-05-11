import { Grid, Group, rem, Stack } from '@mantine/core';
import { SpeciesCounter } from '@/views/dashboard';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import { AuthLayout } from '@/components/Layouts';
import { getTotalBirdSpecies } from '@/utils/supabase/birds';
import { ProfileBox } from '@/views/profile';

interface Props {
  profileName: string;
  user_id: string;
  avatar_url: string | null;
  username: string;
  speciesCount: number;
  totalBirds: number;
}

export default function IdProfilePage({
  profileName,
  user_id,
  avatar_url,
  username,
  speciesCount,
  totalBirds,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  return (
    <AuthLayout username={username} avatar={avatar_url} pageTitle={`${profileName}'s Profile`}>
      <Stack h="100%" w="100%">
        <Group w="100%" justify="center" align="stretch">
          <ProfileBox username={profileName} />
          <SpeciesCounter
            count={speciesCount}
            total={totalBirds}
            checklistPath={`/checklist/${user_id}`}
          />
        </Group>
      </Stack>
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

  const user = await supabase.from('user').select('avatar_url').eq('user_id', data.user.id);
  const profile = await supabase.from('user').select().eq('user_id', id);


  if (user.error || !user.data || user.data.length === 0 || profile.error || !profile.data) {
    return {
      redirect: {
        destination: '/user/dashboard',
        permanent: false,
      },
    };
  }

  const species = await supabase.from('sighting').select('*', { count: 'exact' }).eq('user_id', id);

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
      avatar_url: user.data[0].avatar_url,
      username: data.user.user_metadata.username,
      profileName: profile.data![0].username,
      user_id: profile.data![0].user_id,
      speciesCount: species.count,
      totalBirds: birdCount.total,
    },
  };
}
