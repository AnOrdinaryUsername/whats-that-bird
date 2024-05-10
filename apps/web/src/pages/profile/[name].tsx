import { useRouter } from 'next/router';
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import type { GetServerSidePropsContext } from 'next';

interface Props {
  avatar_url: string;
  username: string;
}

export default function ProfilePage({ username }: Props) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>username: {username}</h1>
    </div>
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

  const { name } = context.query;

  if (!name) {
    return {
      redirect: {
        destination: '/user/dashboard',
        permanent: false,
      },
    };
  }

  const user = await supabase.from('user').select().eq('username', name);

  if (user.data!.length === 0) {
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
    },
  };
}
