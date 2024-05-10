import {
  Accordion,
  Button,
  Group,
  Image,
  Modal,
  ScrollArea,
  Stack,
  Title,
  TextInput,
  rem,
  ModalBaseProps,
  Autocomplete,
  FileInput,
} from '@mantine/core';
import React, { useState } from 'react';
import { DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useForm } from '@mantine/form';
import { createClient } from '@/utils/supabase/component';

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
  const [value, setValue] = useState<Date | null>(null);
  const form = useForm<FormValues>({
    initialValues: {
      species: '',
      location: '',
      image: null,
    },
  });

  //if (value) console.log(new Date(value).toISOString());

  async function submitSighting() {
    const { species, location, image } = form.values;
    
    if (!value) {
      return;
    }

    const { data, error } = await supabase
        .from('sighting')
        .insert({ date: new Date(value).toISOString(), name: species, location, image_url: null })
        .select();
    
    if (error) {
      console.error(error);
      return;
    }
    
    console.log(data)
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
      <Modal.Content>
        <Modal.Header p={rem(32)} pb={0}>
          <Modal.CloseButton />
        </Modal.Header>
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
                value={value}
                onChange={setValue}
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
