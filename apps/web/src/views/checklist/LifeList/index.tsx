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
    <Container className={classes.background}>
      <Stack justify="center" h="100%" gap="xs">
        <Title order={1} className={classes.title}>
          {capitalize(username) || 'user'}&apos;s Life List
        </Title>
        <Title component="div" className={classes.count}>
          {count} / {total} Species Found
        </Title>
      </Stack>
    </Container>
  );
}
