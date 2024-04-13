import {
  Alert,
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
import { IconInfoCircle } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { createClient } from '@/utils/supabase/component';

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [username, setUsername] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  function hideError() {
    setEmailError(null);
  }

  async function checkNameAvailability(name: string) {
    if (name.length <= 3) {
      setNameError('Username length must be greater than 3.');
      return;
    }

    const { data, error } = await supabase.from('user').select().eq('username', name);

    if (error) {
      console.error(error);
      setNameError('Cannot access server. Please try again later.');
      return;
    }

    if (data) {
      if (data.length > 0) {
        setNameError('Username already exists');
        return;
      }
    }

    setUsername(name);
    setNameError(null);
  }

  async function signUp() {
    const { email, password } = form.values;

    // https://supabase.com/docs/reference/javascript/auth-signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      setEmailError(error.message + '.');
      return;
    }

    router.push('/dashboard');
  }

  return (
    <Container pt={rem(24)} pb={rem(24)} size="lg">
      <Header hideButtons />
      <Center>
        <Stack
          bg="var(--mantine-color-white)"
          w="100%"
          maw={rem(550)}
          mih={rem(550)}
          p={rem(75)}
          style={{
            borderRadius: rem(16),
            border:
              '1px solid light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-4))',
          }}
        >
          <form onSubmit={form.onSubmit(signUp)}>
            <Stack justify="center">
              <Title order={1}>Create an Account</Title>
              <TextInput
                withAsterisk
                maw={rem(400)}
                width={'100%'}
                label="Username"
                placeholder="my_unique_name"
                type="text"
                onChange={(event) => checkNameAvailability(event.target.value)}
                error={nameError}
              />
              <TextInput
                withAsterisk
                maw={rem(400)}
                width={'100%'}
                label="Email"
                placeholder="your@email.com"
                type="email"
                autoComplete="email"
                {...form.getInputProps('email')}
              />
              <PasswordInput
                withAsterisk
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
                  Sign Up
                </Button>
              </Group>
            </Stack>
          </form>
          {emailError && (
            <Alert
              variant="light"
              color="red"
              onClose={hideError}
              withCloseButton
              title="Error"
              icon={<IconInfoCircle />}
            >
              {emailError}
            </Alert>
          )}
          <Text size="gray" ta="center" mt={rem(16)}>
            Already have an account?{' '}
            <Anchor underline="always" component={Link} href="/log-in">
              Log In
            </Anchor>
          </Text>
        </Stack>
      </Center>
    </Container>
  );
}
