import { NumberInput, Flex, Button, Group, Card, Box, Image, LoadingOverlay, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import * as z from "zod";
import { TableSort } from "../components/TableExample";
import blizzAPI from "../utils/blizzApi";
import { useState } from "react";
import type { blizzAPIItem, blizzAPIMedia } from "../utils/types";
import axios, { AxiosError } from "axios";
import Bottleneck from "bottleneck";

let DATA: any = [];

const schema = z.object({
  id: z.number().min(35).max(52030),
});

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 100,
});

export default function Home() {
  const form = useForm({ validate: zodResolver(schema), initialValues: { id: undefined } });
  const [itemThumb, setItemThumb] = useState<string>("");
  const [itemName, setItemName] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let itemId = form.values.id;

  const grabItemInfoById = async (itemId: number | undefined) => {
    try {
      setIsLoading(true);
      //@ts-ignore
      const data: blizzAPIItem = await blizzAPI.query(
        `/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US`
      );
      const itemName = data.name;
      const mediaEndpoint = data.media.key.href;
      //@ts-ignore
      const itemIconData: blizzAPIMedia = await blizzAPI.query(
        mediaEndpoint.replace("https://us.api.blizzard.com", "")
      );
      const itemIcon = itemIconData.assets[0].value;
      const reqBody: blizzAPIItem & blizzAPIMedia = { ...data, ...itemIconData };
      axios({ method: "post", url: "/api/grabBlizzData", data: reqBody }).then((res) => {
        if (res.status === 200) {
          console.log("itemID " + res.data.item + res.data.message);
        } else if (res.status === 500) {
          console.log("server error with itemID: " + res.data.item);
        }
      });
      setItemName(itemName);
      setItemThumb(itemIcon);
      setIsLoading(false);
    } catch (error) {
      console.log("itemID " + itemId + " not found");
      const err = error as AxiosError;
      setItemName("item not found");
      setIsLoading(false);
    }
  };

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
              for (let i = 26970; i <= 53000; i++) {
                await limiter.schedule(() => grabItemInfoById(i));
              }
              // grabItemInfoById(values.id);
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
