import { createStyles, rem } from "@mantine/core";
export const useStyles = createStyles((theme) => {
  const key = theme.primaryColor;
  const dt = theme.colors[key] ?? [];

  return {
    header: {
      position: "sticky",
      top: 0,
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      transition: "box-shadow 150ms ease",

      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        borderBottom: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[3]
            : theme.colors.gray[2]
        }`,
      },
    },

    scrolled: {
      boxShadow: theme.shadows.sm,
    },
    rowSelected: {
      backgroundColor:
        theme?.colorScheme === "dark" ? theme.fn.rgba(dt[7] ?? "", 0.2) : dt[0],
    },
  };
});
