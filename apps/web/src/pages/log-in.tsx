import {
  Button,
  Center,
  Container,
  Group,
  rem,
  PasswordInput,
  Stack,
  Text,
  Title,
  TextInput,
  Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { createClient } from '@/utils/supabase/component';
import { GenericLayout } from '@/components/Layouts';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  async function logIn() {
    const { email, password } = form.values;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error(error);
      return;
    }
    router.push('/user/dashboard');
  }

  return (
    <GenericLayout pageTitle="Log In" size="lg" bg="#dce4f5">
      <Header hideButtons />
      <Center h="60%">
        <Stack
          bg="var(--mantine-color-white)"
          w="100%"
          maw={rem(550)}
          h={rem(500)}
          p={rem(75)}
          style={{
            borderRadius: rem(16),
            border:
              '1px solid light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-4))',
          }}
        >
          <form onSubmit={form.onSubmit(logIn)}>
            <Stack justify="center">
              <Title order={1}>Log In</Title>
              <TextInput
                maw={rem(400)}
                width={'100%'}
                label="Email"
                placeholder="your@email.com"
                type="email"
                autoComplete="email"
                {...form.getInputProps('email')}
              />
              <PasswordInput
                maw={rem(400)}
                width={'100%'}
                label="Password"
                placeholder="********"
                type="password"
                autoComplete="current-password"
                {...form.getInputProps('password')}
              />
              <Group mt="md">
                <Button w="100%" type="submit">
                  Log In
                </Button>
              </Group>
            </Stack>
          </form>
          <Text size="gray" ta="center" mt={rem(16)}>
            Don&apos;t have an account?{' '}
            <Anchor underline="always" component={Link} href="/sign-up">
              Sign Up Now
            </Anchor>
          </Text>
        </Stack>
      </Center>
    </GenericLayout>
  );
}
