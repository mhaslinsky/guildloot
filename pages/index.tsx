import { TextInput, Flex, Button, Group } from "@mantine/core";
import { useForm } from "react-hook-form";

interface FormValue {
  id: number;
}

const grabItemById = async (data: FormValue) => {
  const itemId = data.id;
  try {
    const response = await fetch(
      `https://us.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US&access_token=USDb1cb2IQJnHEz8JmJ4GVT3U1lq1zBFns`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

function GrabBlizzItem() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValue>({ defaultValues: { id: undefined } });

  return (
    <Flex h='100vh' justify='center' align='center'>
      <form onSubmit={handleSubmit(grabItemById)}>
        <TextInput
          label='Item ID'
          placeholder='00000'
          id='id'
          {...register("id", {
            onBlur: () => {},
          })}
        />
        <Group position='right' mt='xs'>
          <Button type='submit'>Submit</Button>
        </Group>
      </form>
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
