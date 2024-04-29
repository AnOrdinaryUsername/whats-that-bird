import { Container, ContainerProps, rem } from '@mantine/core';
import { ReactNode } from 'react';

interface Props extends ContainerProps {
  children: ReactNode;
}

export default function GenericLayout(props: Props) {
  return (
    <Container component="main" p={0} m={0} maw="100%" mih="100%" {...props}>
      <Container size="lg" pt={rem(24)} pb={rem(24)}>
        {props.children}
      </Container>
    </Container>
  );
}
