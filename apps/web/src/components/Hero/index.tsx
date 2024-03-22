import { Button, Group, Image, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import classes from './Hero.module.css';

export default function Hero() {
    return (
        <Stack className={classes.stack} align="center" justify="center" h='100%'
            pt={60} pb={180}
            pl={20} pr={20}
            pos='relative'
        >
            <Title order={1} fz={52} fw={700} ta="center" maw={700}>
                Instantly Identify
                <Text fz={52} fw={700} display='inline' variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
                    {' '}Birds{' '}
                </Text>
                With Just One Click
            </Title>
            <Text size="md" mt={16} mb={16} fz={18} ta="center" c='gray'>
                Upload your image and our AI will take care of the work for you.
            </Text>
            <Group justify="center">
                <Button size="lg" component={Link} href="/upload" w={175}>
                    Try It For Free
                </Button>
                <Button size="lg" variant='light' component={Link} href="/about" w={175}>
                    Learn More
                </Button>
            </Group>
            <Image 
                src='https://whats-that-bird.s3.amazonaws.com/low-poly-chicken.png'
                className={classes.bird}
            />
        </Stack>
    );
}