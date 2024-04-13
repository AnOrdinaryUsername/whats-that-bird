import { Container, rem } from '@mantine/core';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

export default function HomePage() {
  return (
    <Container pt={rem(24)} pb={rem(24)} size="lg">
      <Header />
      <Hero />
    </Container>
  );
}
