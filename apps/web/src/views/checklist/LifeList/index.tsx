import { rem, Stack, Container, Title } from '@mantine/core';
import classes from './LifeList.module.css';

interface Props {
  username: string;
  count: number;
  total: number;
}

export default function LifeList({ username, count, total }: Props) {
  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Container className={classes.background} p={rem(96)} pb={rem(76)} h="100%" mih={rem(300)}>
      <Stack justify="center" h="100%" gap="xs">
        <Title order={1} fw={400} fz={rem(48)} lh={1}>
          {capitalize(username) || 'user'}&apos;s Life List
        </Title>
        <Title component="div" fz={rem(20)} fw={300}>
          {count} / {total} Species Found
        </Title>
      </Stack>
    </Container>
  );
}
