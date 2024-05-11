import { useState } from 'react';
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconChevronDown,
} from '@tabler/icons-react';
import classes from './SimpleHeader.module.css';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';

const links = [
  { link: '/user/dashboard', label: 'Dashboard' },
  { link: '/user/checklist', label: 'Checklist' },
  { link: '/community/sightings', label: 'Sightings' },
];

interface Props {
  name: string;
  image: string | null;
}

export default function SimpleHeader({ name, image }: Props) {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error);
      }
    }

    router.push('/');
  }

  const items = links.map((link) => (
    <a key={link.label} href={link.link} className={classes.link}>
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner} pb={rem(6)}>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

        <Menu
          width={260}
          position="bottom-end"
          transitionProps={{ transition: 'pop-top-right' }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton
              className={`${classes.user} ${userMenuOpened ? classes.userActive : null}`}
            >
              <Group gap={7}>
                <Avatar src={image} alt={name} radius="xl" />
                <Text fw={500} size="sm" lh={1} mr={3}>
                  {name}
                </Text>
                <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item
              leftSection={
                <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              }
              onClick={() => router.push('/user/settings')}
            >
              Account settings
            </Menu.Item>
            <Menu.Item
              leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              onClick={signOut}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Container>
    </header>
  );
}
