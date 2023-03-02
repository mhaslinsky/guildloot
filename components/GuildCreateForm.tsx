import { TextInput, Tooltip, Center, Text, Button, Stack, Select, LoadingOverlay } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useCreateGuild } from "../utils/hooks/useCreateGuild";

const serverList = [
  "Skyfury",
  "Maladath",
  "Angerforge",
  "Thekal",
  "Giantstalker",
  "Jin'do",
  "Ashkandi",
  "Atiesh",
  "Azuresong",
  "Mankrik",
  "Myzrael",
  "Old Blanchy",
  "Pagle",
  "Westfall",
  "Windseeker",
  "Obsidian Edge",
  "Shadowstrike",
  "Mirage Raceway",
  "Nethergarde Keep",
  "Pyrewood Village",
  "Auberdine",
  "Everlook",
  "Razorfen",
  "Lakeshire",
  "Chromie",
  "Kingsfall",
  "Quel'Serrar",
  "Oceanic",
  "Remulos",
  "Lionheart",
  "Shimmering Flats",
  "Maraudon",
  "Brightwater Lake",
  "Anathema",
  "Bigglesworth",
  "Benediction",
  "Blaumeux",
  "Faerlina",
  "Fairbanks",
  "Herod",
  "Incendius",
  "Kirtonos",
  "Heartseeker",
  "Kromcrush",
  "Kurinnaxx",
  "Loatheb",
  "Netherwind",
  "Rattlegore",
  "Skeram",
  "Smolderweb",
  "Stalagg",
  "Sulfuras",
  "Thalnos",
  "Thunderfury",
  "Whitemane",
  "Arcanite Reaper",
  "Earthfury",
  "Barman Shanker",
  "Jom Gabbar",
  "Mutanus",
  "Nightfall",
  "Ashbringer",
  "Bloodfang",
  "Dreadmist",
  "Firemaw",
  "Flamelash",
  "Gandling",
  "Gehennas",
  "Golemagg",
  "Judgement",
  "Mograine",
  "Noggenfogger",
  "Razorgore",
  "Shazzrah",
  "Skullflame",
  "Stonespine",
  "Ten Storms",
  "Amnennar",
  "Sulfuron",
  "Finkle",
  "Lucifron",
  "Venoxis",
  "Patchwerk",
  "Dragon's Call",
  "Transcendence",
  "Harbinger of Doom",
  "Flamegor",
  "Wyrmthalak",
  "Rhok'delar",
  "Dragonfang",
  "Heartstriker",
  "Mandokir",
  "Bonescythe",
  "Dreadnaught",
  "Ironfoe",
  "Arugal",
  "Felstriker",
  "Yojamba",
  "Swamp of Sorrows",
  "Hillsbrad",
  "Iceblood",
  "Lokholar",
  "Ragnaros",
  "Ivus",
  "Jasperlode Mine",
];

const schema = z.object({
  name: z
    .string()
    .min(2, { message: "Must be over 2 characters" })
    .max(24, { message: "Must be under 24 characters" }),
  server: z.string().min(1, { message: "Select a Realm" }),
});

export function GuildCreateForm() {
  const { mutate: createGuild, isLoading } = useCreateGuild();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      name: "",
      server: "",
      avatar: "",
    },
  });

  const rightSectionName = (
    <Tooltip
      label='You are limited to 3 guilds per account'
      position='top-end'
      withArrow
      transition='pop-bottom-right'
    >
      <Text color='dimmed' sx={{ cursor: "help" }}>
        <Center>
          <IconInfoCircle size={18} stroke={1.5} />
        </Center>
      </Text>
    </Tooltip>
  );

  const rightSectionAva = (
    <Tooltip label='Not required' position='top-end' withArrow transition='pop-bottom-right'>
      <Text color='dimmed' sx={{ cursor: "help" }}>
        <Center>
          <IconInfoCircle size={18} stroke={1.5} />
        </Center>
      </Text>
    </Tooltip>
  );

  return (
    <form
      onSubmit={form.onSubmit(({ name, server, avatar }) => {
        console.log(name, server, avatar);
        createGuild({ guildName: name, server, avatar });
      })}
    >
      <Stack>
        <LoadingOverlay visible={isLoading} />
        <TextInput
          rightSection={rightSectionName}
          label='Guild Name'
          placeholder='Method'
          {...form.getInputProps("name")}
        />
        <Select
          searchable
          data={serverList}
          label='Server'
          placeholder='Skyfury'
          {...form.getInputProps("server")}
        />
        <TextInput
          rightSection={rightSectionAva}
          label='Guild Avatar'
          placeholder='https://i.imgur.com/soAePmA.jpeg'
          {...form.getInputProps("avatar")}
        />
        <Button type='submit'>Create!</Button>
      </Stack>
    </form>
  );
}
