import { Stack, Container, ContainerProps, rem } from '@mantine/core';
import { ReactNode } from 'react';
import { NextSeo } from 'next-seo';
import SimpleHeader from '../SimpleHeader';

interface Props extends ContainerProps {
  pageTitle?: string;
  pageDescription?: string;
  username: string;
  avatar: string | null;
  children: ReactNode;
}

export default function AuthLayout({
  pageTitle,
  pageDescription,
  children,
  username,
  avatar,
  ...props
}: Props) {
  return (
    <>
      <NextSeo title={pageTitle} description={pageDescription} />
      <SimpleHeader name={username} image={avatar} />
      <Container component="main" h="100%" size="xl" {...props}>
        <Stack h="100%" w="100%">
          {children}
        </Stack>
      </Container>
    </>
  );
}
