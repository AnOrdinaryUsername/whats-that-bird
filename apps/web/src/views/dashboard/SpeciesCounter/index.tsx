import {
  rem,
  ActionIcon,
  Container,
  Group,
  Progress,
  Stack,
  Text,
  Title,
  useMantineTheme,
  Button,
} from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './SpeciesCounter.module.css';

interface Props {
  count: number;
  total: number;
  checklistPath: string;
}

export default function SpeciesCounter({ count, total, checklistPath }: Props) {
  const theme = useMantineTheme();

  return (
    <Container
      className={classes.background}
      p={rem(48)}
      pt={rem(24)}
      pl={rem(24)}
      pr={rem(24)}
      mih={rem(300)}
    >
      <Stack justify="space-between" h="100%">
        <Group justify="space-between">
          <Title order={2} fw={300} fz={rem(20)} lh={1}>
            SPECIES FOUND
          </Title>
          <ActionIcon
            variant="filled"
            color="gray"
            size="xl"
            radius="xl"
            aria-label="Go to checklist"
            component={Link}
            href={checklistPath}
          >
            <IconArrowUpRight style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Group>
        <Stack>
          <Group>
            <Text className={classes.count}>
              {count}
              <Text component="span" className={classes.total}>
                {' '}
                / {total}
              </Text>
            </Text>
          </Group>
          <Progress
            radius="xs"
            color={theme.colors.primary[6]}
            value={Math.round((count / total) * 100)}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
