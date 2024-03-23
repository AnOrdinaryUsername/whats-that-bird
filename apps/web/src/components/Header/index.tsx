import { useState } from 'react';
import { Anchor, Button, Container, Group, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import Link from 'next/link';

const links = [
  { link: '/about', label: 'Features' },
  { link: '/gallery', label: 'Gallery' },
  { link: '/donate', label: 'Donate' },
  { link: '/community', label: 'Contact' },
];

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState<any>(null);

  const items = links.map((link) => (
    <Anchor
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </Anchor>
  ));

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Group justify="space-between" h="100%" w="100%">
          <Anchor href="/">What&apos;s That Bird?</Anchor>
          <Group gap={5} visibleFrom="xs">
            {items}
          </Group>
          <Group visibleFrom="sm">
            <Button component={Link} variant="subtle" href="/log-in">
              Log in
            </Button>
            <Button component={Link} variant="filled" href="/sign-up">
              Sign up
            </Button>
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </Group>
      </Container>
    </header>
  );
}
