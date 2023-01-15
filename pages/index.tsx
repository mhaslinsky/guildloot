import { Flex, Button, Group, Card, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import FloatingLabelTextarea from "../components/floatingLabelTextarea";
import axios from "axios";
import Bottleneck from "bottleneck";
import { useGrabItemInfoById } from "../utils/hooks/useGrabItemInfoById";
import { NextPage } from "next";
import { RCLootItem } from "../utils/types";

const Home: NextPage<{ data: RCLootItem[] }> = (props) => {
  const [lootData, setLootData] = useState<string>("");
  const { getBlizzItem } = useGrabItemInfoById();
  const limiter = new Bottleneck({ maxConcurrent: 8, minTime: 200 });

  const inputChangeHandler = (value: string) => {
    setLootData(value);
  };

  const onSubmit = async (rcLootData: string) => {
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

  useEffect(() => {
    console.log(props.data);
  }, [props.data]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios({ url: "/api/loot", method: "GET" });
  //     console.log(response.data);
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      <Flex mt='xl' mb='xl' justify='center' align='center'>
        <Card w='100%' m='xs'>
          <form
            onSubmit={async (e) => {
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
};

export default Home;

export async function getServerSideProps(context: any) {
  const { data } = await axios({ url: "http://localhost:3000/api/loot", method: "GET" });
  return {
    props: { data }, // will be passed to the page component as props
  };
}
