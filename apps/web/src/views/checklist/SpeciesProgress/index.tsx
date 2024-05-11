import { rem, Container, Title, RingProgress, Center } from '@mantine/core';
import classes from './SpeciesProgress.module.css';

interface Props {
  percentage: number;
}

export default function SpeciesProgress({ percentage }: Props) {
  return (
    <Container className={classes.background} mih={rem(300)}>
      <Center p={rem(24)} h="100%">
        <RingProgress
          label={<CompletionLabel percentage={percentage} />}
          size={220}
          thickness={6}
          sections={[{ value: percentage, color: 'primary' }]}
        />
      </Center>
    </Container>
  );
}

function CompletionLabel({ percentage }: Props) {
  return (
    <Title className={classes.label} order={2}>
      {percentage}%<span className={classes.completed}>COMPLETED</span>
    </Title>
  );
}
