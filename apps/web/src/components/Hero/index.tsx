import { Button, Group, Image, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import Head from 'next/head';
import classes from './Hero.module.css';
import useSound from 'use-sound';

export default function Hero() {
  const [quack] = useSound('/quack.mp3', { volume: 0.25 });

  function playSound() {
    quack();
  }

  return (
    <Stack className={classes.stack} align="flex-start" justify="center" pos="relative">
      <Title order={1}>
        Identify
        <Text component="b" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
          {' '}
          California Birds{' '}
        </Text>
        With Just{' '}
        <Text component="span" className={classes.span}>
          One Click
        </Text>
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
        src="https://d2jxjlx1x5gewb.cloudfront.net/low-poly-chicken.png"
        alt=""
        visibleFrom="md"
        className={classes.bird}
        onClick={playSound}
      />
    </Stack>
  );
}
