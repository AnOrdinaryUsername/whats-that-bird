import { GenericLayout } from '@/components/Layouts';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

export default function HomePage() {
  return (
    <GenericLayout size="lg" bg="#dce4f5">
      <Header />
      <Hero />
    </GenericLayout>
  );
}
