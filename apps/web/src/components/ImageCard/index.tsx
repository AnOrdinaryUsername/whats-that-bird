import { Card, Text, Group, Center, rem, useMantineTheme } from '@mantine/core';
import classes from './ImageCard.module.css';
import type { Sighting } from '@/types';

export default function ImageCard({ sighting_id, image_url, location, name, date }: Sighting) {
  const theme = useMantineTheme();

  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      component="a"
      href={`/sightings/${sighting_id}`}
    >
      <div
        className={classes.image}
        style={{
          backgroundImage: `url(${image_url ?? 'https://placehold.co/800?text=No+Image&font=source%20sans%20pro'})`,
        }}
      />
      <div className={classes.overlay} />

      <div className={classes.content}>
        <div>
          <Text size="lg" className={classes.name} fw={500}>
            {name.toUpperCase()}
          </Text>

          <Group justify="space-between" gap="xs">
            <Text size="sm" className={classes.location}>
              {location}
            </Text>
            <Center>
              <Text size="sm" className={classes.bodyText}>
                {new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </Center>
          </Group>
        </div>
      </div>
    </Card>
  );
}
