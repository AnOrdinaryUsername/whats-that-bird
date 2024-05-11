import { rem, Container, Title, Space } from '@mantine/core';
import classes from './ProfileBox.module.css';

interface Props {
  username: string;
}

export default function ProfileBox({ username }: Props) {
  return (
    <Container className={classes.background}>
      <Title order={1} fw={400} fz={rem(64)} lh={1}>
        {username || 'user'}
      </Title>
    </Container>
  );
}
