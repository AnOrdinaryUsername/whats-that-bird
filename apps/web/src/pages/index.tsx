import { Container } from '@mantine/core';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

export default function IndexPage() {
  return (
    <Container size='lg'>
      <Header />
      <Hero />
    </Container>
  );
}
