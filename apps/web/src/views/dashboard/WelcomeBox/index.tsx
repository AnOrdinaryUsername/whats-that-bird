import { rem, Container, Title } from '@mantine/core';
import classes from './WelcomeBox.module.css';

interface Props {
  username: string;
}

export default function WelcomeBox({ username }: Props) {
  return (
    <Container className={classes.background} p={rem(96)} pb={rem(76)}>
      <Title component="div" fz={rem(24)} fw={300}>
        Welcome back,
      </Title>
      <Title order={1} fw={400} fz={rem(64)} lh={1}>
        {username || 'user'}
      </Title>
    </Container>
  );
}
