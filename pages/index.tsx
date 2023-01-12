import { Flex, Button, Group, Card, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import * as z from "zod";
import Bottleneck from "bottleneck";
import { useState } from "react";
import FloatingLabelTextarea from "../components/floatingLabelTextarea";
// import { useGrabItemInfoById } from "../utils/hooks/useGrabItemInfoById";

const schema = z.object({
  id: z.number().min(21).max(56807),
});

const limiter = new Bottleneck({
  maxConcurrent: 2,
  minTime: 100,
});

export default function Home() {
  const form = useForm({ validate: zodResolver(schema), initialValues: { rawLootJSON: undefined } });
  const [value, setValue] = useState("");

  const inputChangeHandler = (value: string) => {
    setValue(value);
  };
  // const { itemThumb, itemName, isLoading, getBlizzItem } = useGrabItemInfoById();

  return (
    <>
      <Flex mt='xl' mb='xl' justify='center' align='center'>
        <Card w='100%' m='xs'>
          <form
            onSubmit={form.onSubmit((values) => {
              console.log(values.rawLootJSON);
            })}
          >
            <FloatingLabelTextarea
              minRows={4}
              maxRows={10}
              value={value}
              inputValueChange={inputChangeHandler}
              placeholder='Paste your RCLootCouncil JSON data here'
              label='RCLootCouncil JSON'
            />
            <Group position='right' mt='xs'>
              <Button type='submit'>Submit</Button>
            </Group>
            <Text>{value}</Text>
          </form>
        </Card>
      </Flex>
    </>
  );
}
