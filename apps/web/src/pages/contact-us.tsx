import { GenericLayout } from '@/components/Layouts';
import Header from '@/components/Header';
import { rem, Stack, Title, Text } from '@mantine/core';

export default function ContactUsPage() {
  return (
    <GenericLayout size="lg" bg="#dce4f5">
      <Header />
      <Stack w="100%" gap="xl" mb={rem(96)} pt={rem(40)}>
        <Stack component="section">
          <Stack mb={rem(32)}>
            <Title order={1} fw={500} fz={rem(48)} ta='center'>
              Work in Progress
            </Title>
            <Text fz={rem(20)} ta='center'>
              This area is not finished yet.
            </Text>
          </Stack>
        </Stack>
        </Stack>
    </GenericLayout>
  );
}
