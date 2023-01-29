import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
} from "@mantine/core";
import { IconBrandGoogle, IconBrandDiscord } from "@tabler/icons";
import { signIn } from "next-auth/react";
import { GoogleButton } from "./Buttons/GoogleButton";
import { DiscordButton } from "./Buttons/DiscordButton";

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) => (val.length <= 6 ? "Password should include at least 6 characters" : null),
    },
  });

  return (
    <Paper radius='md' p='xl' withBorder {...props}>
      <Text size='lg' weight={500}>
        Welcome to ALT, {type} with
      </Text>
      <Group grow mb='md' mt='md'>
        <GoogleButton
          onClick={() => {
            signIn("google");
          }}
          radius='xl'
        >
          Google
        </GoogleButton>
        <DiscordButton
          radius='xl'
          onClick={() => {
            signIn("discord");
          }}
        >
          Discord
        </DiscordButton>
      </Group>
      <Divider label='Or continue with email' labelPosition='center' my='lg' />
      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
          {type === "register" && (
            <TextInput
              label='Name'
              placeholder='Your name'
              value={form.values.name}
              onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
            />
          )}
          <TextInput
            required
            label='Email'
            placeholder='hello@mantine.dev'
            value={form.values.email}
            onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
            error={form.errors.email && "Invalid email"}
          />
          <PasswordInput
            required
            label='Password'
            placeholder='Your password'
            value={form.values.password}
            onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
            error={form.errors.password && "Password should include at least 6 characters"}
          />
        </Stack>
        <Group position='apart' mt='xl'>
          <Anchor component='button' type='button' color='dimmed' onClick={() => toggle()} size='xs'>
            {type === "register" ? "Already have an account? Login" : "Don't have an account? Register"}
          </Anchor>
          <Button type='submit'>{upperFirst(type)}</Button>
        </Group>
      </form>
    </Paper>
  );
}
