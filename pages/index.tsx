import { useForm } from "@mantine/form";
import { TextInput } from "@mantine/core";

const grabItemById = async (itemId: number) => {
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
  const form = useForm({
    initialValues: {
      itemId: 0,
    },
    validate: {
      itemId: (value) => value > 0 || "Item ID must be greater than 0",
    },
  });

  return (
    <div>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput label='itemId' placeholder='00000' {...form.getInputProps("itemId")} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <GrabBlizzItem />
    </>
  );
}
