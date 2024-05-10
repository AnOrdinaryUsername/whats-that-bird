const url =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.backendUrl;

interface BirdCount {
  result: 'ok';
  total: number;
}

async function getTotalBirdSpecies(): Promise<BirdCount> {
  const birdCount = await fetch(`${url}/api/birds/count`).then((res) => res.json());
  return birdCount;
}

interface BirdSpecies {
  result: 'ok';
  total: number;
  birds: Array<string>;
}

async function getAllBirdSecies(): Promise<BirdSpecies> {
  const species = await fetch(`${url}/api/birds`).then((res) => res.json());
  return species;
}

interface VerificationSuccess {
  result: 'ok';
}

interface VerificationError {
  result: 'error';
  reason: string;
}

type BirdVerification = VerificationSuccess | VerificationError;

async function verfiyBird(name: string): Promise<BirdVerification> {
  const result = await fetch(`${url}/api/birds/${name}`).then((res) => res.json());
  return result;
}

export { getAllBirdSecies, getTotalBirdSpecies, verfiyBird };
