import { Group, Stack, Text, rem } from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

export default function BaseDemo(props: Partial<DropzoneProps>) {
    return (
        <Stack align="center" justify="center" style={{ height: "100%" }}>
            <Dropzone
                onDrop={(files) => console.log("accepted image", files)}
                onReject={(files) => console.log("rejected image", files)}
                maxSize={5 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                style={{ cursor: "pointer" }}
                {...props}
            >
                <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: "none" }}
                >
                    <Dropzone.Accept>
                        <IconUpload
                            style={{
                                width: rem(52),
                                height: rem(52),
                                color: "var(--mantine-color-blue-6)",
                            }}
                            stroke={1.5}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            style={{
                                width: rem(52),
                                height: rem(52),
                                color: "var(--mantine-color-red-6)",
                            }}
                            stroke={1.5}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconPhoto
                            style={{
                                width: rem(52),
                                height: rem(52),
                                color: "var(--mantine-color-dimmed)",
                            }}
                            stroke={1.5}
                        />
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline>
                            Drag image here or click to select file
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                            Attach your bird photo
                        </Text>
                    </div>
                </Group>
            </Dropzone>
        </Stack>
    );
}
