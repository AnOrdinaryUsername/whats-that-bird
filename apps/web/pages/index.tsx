import { Button, Stack, Title } from "@mantine/core";
import Link from "next/link";

export default function IndexPage() {
    return (
        <Stack align="center" justify="center" style={{ height: "100%" }}>
            <Title>What's That Bird</Title>
            <Button size="med" component={Link} href="/upload">
                Upload Photo
            </Button>
        </Stack>
    );
}
