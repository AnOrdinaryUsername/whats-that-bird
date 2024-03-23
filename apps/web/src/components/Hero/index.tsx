import { Button, Group, Image, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import classes from './Hero.module.css';

export default function Hero() {
  return (
    <Stack className={classes.stack} align="flex-start" justify="center" pos="relative">
      <Title order={1}>
        Instantly Identify
        <Text component="b" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
          {' '}
          Birds{' '}
        </Text>
        With Just One Click
      </Title>
      <Text size="md" c="gray">
        Upload your image and our AI will take care of the work for you.
      </Text>
      <Group className={classes.buttons}>
        <Button size="lg" component={Link} href="/upload">
          Try It For Free
        </Button>
        <Button size="lg" variant="light" component={Link} href="/about">
          Learn More
        </Button>
      </Group>
      <Image
        src="https://whats-that-bird.s3.amazonaws.com/low-poly-chicken.png"
        visibleFrom="md"
        className={classes.bird}
      />
    </Stack>
  );
}
