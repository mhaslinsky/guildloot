import { Flex, Button, Group, Card, Text } from "@mantine/core";
import { useState } from "react";
import FloatingLabelTextarea from "../components/floatingLabelTextarea";
import axios from "axios";

export default function Home() {
  const [lootData, setLootData] = useState("");

  const inputChangeHandler = (value: string) => {
    setLootData(value);
  };

  const onSubmit = async (rcLootData: any) => {
    axios
      .post("/api/loot", { rcLootData })
      .then((res) => {
        console.log(res.data);
        setLootData("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Flex mt='xl' mb='xl' justify='center' align='center'>
        <Card w='100%' m='xs'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(lootData);
            }}
          >
            <FloatingLabelTextarea
              minRows={6}
              maxRows={20}
              value={lootData}
              inputValueChange={inputChangeHandler}
              placeholder='Paste your RCLootCouncil JSON data here'
              label='RCLootCouncil JSON'
            />
            <Group position='right' mt='xs'>
              <Button type='submit'>Submit</Button>
            </Group>
          </form>
        </Card>
      </Flex>
    </>
  );
}
