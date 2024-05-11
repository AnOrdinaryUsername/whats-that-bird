import { Title, Stack, Divider, FileInput, Button, rem } from '@mantine/core';
import type { GetServerSidePropsContext } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import { AuthLayout } from '@/components/Layouts';
import React, { useState } from 'react';
import '@mantine/dates/styles.css';
import { useForm } from '@mantine/form';
import { createClient } from '@/utils/supabase/component';
import { notifications } from '@mantine/notifications';

interface FormValues {
  image: File | null;
}

interface Props {
  username: string;
  avatar_url: string;
  user_id: string;
}

export default function SightingsPage({ username, avatar_url, user_id }: Props) {
  const supabase = createClient();
  const [avatarImage, setAvatarImage] = useState<string>(avatar_url);

  const form = useForm<FormValues>({
    initialValues: {
      image: null,
    },
  });

  async function updateSettings() {
    const { image } = form.values;
    let result: { result: 'ok'; image_url: string } | null = null;

    if (!image) {
      notifications.show({
        withCloseButton: true,
        autoClose: 30000,
        title: 'Upload Error',
        message: 'No image was entered.',
        color: 'red',
        loading: false,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    const url =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.backendUrl;

    result = await fetch(`${url}/api/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            'There seems to be a problem with the server at the moment. Please try again later.',
          );
        }
        return res.json();
      })
      .catch((error) => {
        notifications.show({
          withCloseButton: true,
          autoClose: 30000,
          title: 'Upload Image Error',
          message: error.message,
          color: 'red',
          loading: false,
        });
      });

    const { error } = await supabase
      .from('user')
      .update({
        avatar_url: result?.image_url,
      })
      .eq('user_id', user_id);

    if (error) {
      notifications.show({
        withCloseButton: true,
        autoClose: 30000,
        title: 'Upload Error',
        message: 'Unable to upload data. Please try again later.',
        color: 'red',
        loading: false,
      });
      return;
    }

    notifications.show({
      withCloseButton: true,
      autoClose: 30000,
      title: 'Success!',
      message: 'Your avatar has been updated.',
      color: 'green',
      loading: false,
    });
    setAvatarImage(result!.image_url);
  }

  return (
    <AuthLayout username={username} avatar={avatarImage} pageTitle="Settings">
      <Stack h="100%" w="100%" gap="xs">
        <Title order={1} fw={500}>
          Settings
        </Title>
        <Divider w="100%" my="md" />
        <form onSubmit={form.onSubmit(updateSettings)}>
          <Stack maw={rem(400)} w="100%">
            <FileInput
              label="Image"
              description="Add your avatar image"
              accept="image/*"
              {...form.getInputProps('image')}
            />
            <Button variant="filled" type="submit" maw={rem(200)}>
              Update Settings
            </Button>
          </Stack>
        </form>
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

  if (user.error) {
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
