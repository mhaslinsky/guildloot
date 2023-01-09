import { NumberInput, Flex, Button, Group, Card, Box, Image, LoadingOverlay, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import * as z from "zod";
import { TableSort } from "../components/TableExample";
import Bottleneck from "bottleneck";
import { useGrabItemInfoById } from "../utils/hooks/useGrabItemInfoById";

let DATA: any = [];

const schema = z.object({
  id: z.number().min(21).max(56807),
});

const limiter = new Bottleneck({
  maxConcurrent: 2,
  minTime: 100,
});

export default function Home() {
  const form = useForm({ validate: zodResolver(schema), initialValues: { id: undefined } });
  const { itemThumb, itemName, isLoading, getBlizzItem } = useGrabItemInfoById();
  let itemId = form.values.id;

  return (
    <>
      <Flex mt='xl' mb='xl' justify='center' align='center' sx={{ position: "relative" }}>
        <LoadingOverlay overlayBlur={2} visible={isLoading} />
        <Card w={250} h={130} mr={"sm"}>
          <Flex justify='flex-start' align='center' direction='column'>
            {itemName && <Text>{itemName}</Text>}
            {(itemThumb || isLoading) && (
              <Box w={75} h={75}>
                {itemThumb && (
                  <a href={`https://www.wowhead.com/wotlk/item=${itemId}/`}>
                    <Image alt={`${itemName}`} src={itemThumb} />
                  </a>
                )}
              </Box>
            )}
          </Flex>
        </Card>

        <Card h={130}>
          <form
            onSubmit={form.onSubmit(async (values) => {
              // for (let i = 53000; i <= 60000; i++) {
              //   await limiter.schedule(() => grabItemInfoById(i));
              // }
              await getBlizzItem(values.id);
            })}
          >
            <NumberInput {...form.getInputProps("id")} hideControls placeholder='12345' label='Item ID' />
            <Group position='right' mt='xs'>
              <Button type='submit'>Submit</Button>
            </Group>
          </form>
        </Card>
      </Flex>

      <TableSort data={DATA} />
    </>
  );
}
