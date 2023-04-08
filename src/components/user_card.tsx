import { createStyles, Avatar, Text, Group, Card, Stack, LoadingOverlay } from "@mantine/core";
import { IconPhoneCall, IconAt, IconTrack } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily ?? ""}`,
  },
}));

interface UserInfoIconsProps {
  avatar: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  cin: string | undefined;
}

export function UserInfoIcons({
  avatar,
  name,
  title,
  phone,
  email,
  cin,
}: UserInfoIconsProps) {
  const { classes } = useStyles();
  return (
    <Card>
        
      <Group noWrap align='center'>
        <Avatar src={avatar} size={200} radius="md" />
        <Stack>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {title}
          </Text>

          <Text fz="lg" fw={500} className={classes.name}>
            {name}
          </Text>

          <Group noWrap spacing={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {email}
            </Text>
          </Group>

          <Group noWrap spacing={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {phone}
            </Text>
          </Group>

          <Group noWrap spacing={10} mt={5}>
            <IconTrack stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {cin}
            </Text>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
