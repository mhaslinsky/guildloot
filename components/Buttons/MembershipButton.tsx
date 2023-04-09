import { useState } from "react";
import { useInterval, useMediaQuery } from "@mantine/hooks";
import { createStyles, Button, Progress } from "@mantine/core";
import { useGrabUserInfo } from "../../utils/hooks/queries/useUserInfo";
import { Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRequestGuildMembership } from "../../utils/hooks/mutations/useRequestGuildMembership";

const useStyles = createStyles(() => ({
  button: {
    position: "relative",
    transition: "background-color 150ms ease",
  },

  progress: {
    position: "absolute",
    bottom: -1,
    right: -1,
    left: -1,
    top: -1,
    height: "auto",
    backgroundColor: "transparent",
    zIndex: 0,
  },

  label: {
    position: "relative",
    zIndex: 1,
  },
}));

export function MembershipButton(rowData: any) {
  const { classes, theme } = useStyles();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { data: availableGuilds } = useGrabUserInfo();
  const { data: session } = useSession();
  const { mutate: requestGuildMembership } = useRequestGuildMembership();

  const guildsMemberships = availableGuilds?.guildAdmin
    .concat(availableGuilds.guildOfficer)
    .concat(availableGuilds.guildMember);
  const inGuild = guildsMemberships?.find((guild: any) => {
    return guild.id === rowData.rowData.id;
  });

  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 2;
        }

        interval.stop();
        setLoaded(true);
        return 0;
      }),
    20
  );

  return (
    <>
      {session ? (
        inGuild ? (
          <Text color={theme.colors[theme.primaryColor][2]} pr={isMobile ? "sm" : "lg"} weight={700}>
            Member
          </Text>
        ) : (
          <Button
            size='sm'
            styles={{ root: { width: isMobile ? "7rem" : "13rem" } }}
            onClick={() => {
              requestGuildMembership({ guildID: rowData.rowData.id });
              loaded ? setLoaded(false) : !interval.active && interval.start();
            }}
            color={loaded ? "teal" : theme.primaryColor}
          >
            <div className={classes.label}>
              {isMobile
                ? progress !== 0
                  ? "Requesting"
                  : loaded
                  ? "Requested!"
                  : "Request"
                : progress !== 0
                ? "Requesting Membership"
                : loaded
                ? "Membership Requested!"
                : "Request Membership"}
            </div>
            {progress !== 0 && (
              <Progress
                value={progress}
                className={classes.progress}
                color={theme.fn.rgba(theme.colors[theme.primaryColor][2], 0.35)}
                radius='sm'
              />
            )}
          </Button>
        )
      ) : (
        <Text color={theme.colors[theme.primaryColor][2]} pr={isMobile ? "sm" : "lg"} weight={700}>
          Login to Join
        </Text>
      )}
    </>
  );
}
