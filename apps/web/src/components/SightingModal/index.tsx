import {
  Button,
  Group,
  Modal,
  ScrollArea,
  Stack,
  TextInput,
  rem,
  ModalBaseProps,
  Autocomplete,
  FileInput,
  LoadingOverlay,
} from '@mantine/core';
import React, { useState } from 'react';
import { DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useForm } from '@mantine/form';
import { createClient } from '@/utils/supabase/component';
import { notifications } from '@mantine/notifications';
import { verfiyBird } from '@/utils/supabase/birds';

interface Props extends ModalBaseProps {
  speciesList: Array<string>;
  onUpdate: React.Dispatch<React.SetStateAction<any>>;
}

interface FormValues {
  species: string;
  location: string;
  image: File | null;
}

export default function SightingModal({ opened, onClose, onUpdate, speciesList }: Props) {
  const supabase = createClient();
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const form = useForm<FormValues>({
    initialValues: {
      species: '',
      location: '',
      image: null,
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function submitSighting() {
    setIsLoading(true);
    const { species, location, image } = form.values;

    const name = await verfiyBird(species);

    if (name.result === 'error') {
      setIsLoading(false);
      notifications.show({
        withCloseButton: true,
        autoClose: 30000,
        title: 'Name Error',
        message: name.reason,
        color: 'red',
        loading: false,
      });
      return;
    }

    if (!dateTime) {
      setIsLoading(false);
      notifications.show({
        withCloseButton: true,
        autoClose: 30000,
        title: 'Date Error',
        message: 'Date is empty. Please enter a date into the field.',
        color: 'red',
        loading: false,
      });
      return;
    }

    if (location.length < 3) {
      setIsLoading(false);
      notifications.show({
        withCloseButton: true,
        autoClose: 30000,
        title: 'Date Error',
        message: 'Location name is too short (4 characters minimum).',
        color: 'red',
        loading: false,
      });
      return;
    }

    let result: { result: 'ok'; image_url: string } | null = null;

    if (image) {
      const formData = new FormData();
      formData.append('file', image);

      const url =
        process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.backendUrl;

      result = await fetch(`${url}/api/upload`, {
        method: 'POST',
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              'There seems to be a problem with the server at the moment. Please try again later.',
            );
          }
          return res.json();
        })
        .catch((error) => {
          setIsLoading(false);
          notifications.show({
            withCloseButton: true,
            autoClose: 30000,
            title: 'Upload Image Error',
            message: error.message,
            color: 'red',
            loading: false,
          });
        });
    }

    const { data, error } = await supabase
      .from('sighting')
      .insert({
        date: new Date(dateTime).toISOString(),
        name: species,
        location,
        image_url: result?.image_url,
      })
      .select();

    if (error) {
      setIsLoading(false);
      notifications.show({
        withCloseButton: true,
        autoClose: 30000,
        title: 'Upload Error',
        message: 'Unable to upload data. Please try again later.',
        color: 'red',
        loading: false,
      });
      return;
    }

    setIsLoading(false);
    onClose();
    onUpdate((prevState: any) => [...prevState, data[0]]);
  }

  return (
    <Modal.Root
      size="lg"
      opened={opened}
      onClose={onClose}
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <Modal.Overlay />
      <Modal.Content pos="relative">
        <Modal.Header p={rem(32)} pb={0}>
          <Modal.CloseButton />
        </Modal.Header>
        <LoadingOverlay visible={isLoading} />
        <form onSubmit={form.onSubmit(submitSighting)}>
          <Modal.Body pl={rem(32)} pr={rem(32)} pb={rem(32)} pt={0}>
            <Stack align="stretch">
              <Modal.Title fw={600} fz={rem(26)} ff="Rubik">
                Add Bird Sighting
              </Modal.Title>
              <Autocomplete
                label="Species Name"
                placeholder="California Quail, Mallard, etc."
                data={speciesList}
                withAsterisk
                {...form.getInputProps('species')}
              />
              <TextInput
                label="Location"
                withAsterisk
                description="Enter the location where you saw the bird"
                placeholder="Bolsa Chica Ecological Reserve"
                {...form.getInputProps('location')}
              />
              <FileInput
                label="Image"
                description="Add your bird image"
                placeholder="bird.jpg"
                accept="image/*"
                {...form.getInputProps('image')}
              />
              <DateTimePicker
                label="Date and time"
                withAsterisk
                value={dateTime}
                onChange={setDateTime}
                clearable
                defaultValue={new Date()}
              />
            </Stack>
          </Modal.Body>
          <Group justify="flex-end" p={rem(32)} bg="var(--mantine-color-gray-0)">
            <Button variant="filled" maw={rem(130)} type="submit">
              Add Sighting
            </Button>
          </Group>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
