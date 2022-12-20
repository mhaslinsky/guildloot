import { NumberInput, Flex, Button, Group, Card } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import * as z from "zod";

const schema = z.object({
  id: z.number().min(1).max(52030),
});

const grabItemById = async (itemId: number | undefined) => {
  try {
    const response = await fetch(
      `https://us.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US&access_token=${process.env.BLIZZ_API_TOKEN}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

function GrabBlizzItem() {
  const form = useForm({ validate: zodResolver(schema), initialValues: { id: undefined } });
  let itemId = form.values.id;

  return (
    <Flex h='100vh' justify='center' align='center'>
      <Card>
        <form
          onSubmit={form.onSubmit((values) => {
            grabItemById(values.id);
          })}
        >
          <NumberInput {...form.getInputProps("id")} hideControls placeholder='12345' label='Item ID' />
          <Group position='right' mt='xs'>
            <Button type='submit'>Submit</Button>
          </Group>
        </form>
      </Card>
      <a href={`https://www.wowhead.com/wotlk/item=${itemId}/`}>test</a>
    </Flex>
  );
}

export default function Home() {
  return (
    <>
      <GrabBlizzItem />
    </>
  );
}
