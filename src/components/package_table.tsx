import { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  rem,
  Kbd,
  Text,
  Flex,
  Badge,
  Box,
  Modal,
  UnstyledButton,
  Button,
  Menu,
  useMantineTheme,
} from "@mantine/core";
import type { FullPackage } from "~/pages";
import { IconPackage } from "@tabler/icons-react";
import { IconPhone } from "@tabler/icons-react";
import { IconBrandTelegram } from "@tabler/icons-react";
import { IconPrinter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { PackageShow } from "./package_show";
import { Package } from "@prisma/client";

const useStyles = createStyles((theme) => ({
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
}));

interface TableScrollAreaProps {
  data: FullPackage[];
}

export function TablePackage({ data }: TableScrollAreaProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const theme = useMantineTheme();

  const rows = data.map((row) => (
    <tr key={row.id}>
      <td>
        <UnstyledButton
          onClick={() => {
            setCurrentPackage(row);
            open();
          }}
        >
          <Text fw={"bold"}>{row.tracking_number}</Text>
          <Flex gap={1} align={"center"}>
            <IconPackage size={16} stroke={""} />
            <Text fw={"lighter"} fz={"xs"}>
              {row.reference}
            </Text>
          </Flex>
        </UnstyledButton>
      </td>
      <td>
        <Badge color={row.status.style}>{row.status.name}</Badge>
      </td>
      <td>
        <Text fw={"bold"}>{row.customer.name}</Text>
        <Flex gap={1} align={"center"}>
          <IconPhone size={16} stroke={""} />
          <Text fw={"lighter"} fz={"xs"}>
            {row.customer.phone}
          </Text>
        </Flex>
      </td>
      <td>
        <Text fw={"bold"}>{row.customer.city.name}</Text>
        <Flex gap={1} align={"center"}>
          <IconBrandTelegram size={16} stroke={""} />
          <Text fw={"lighter"} fz={"xs"}>
            {row.customer.city.name}
          </Text>
        </Flex>
      </td>
      <td>
        <Text fw={"bold"}>{row.creator.name}</Text>
        <Flex gap={1} align={"center"}>
          <IconBrandTelegram size={16} stroke={""} />
          <Text fw={"lighter"} fz={"xs"}>
            {row.creator.phone_number}
          </Text>
        </Flex>
      </td>
      <td>{row.printed ? <IconPrinter /> : null}</td>
      <td>
        <Text fw={"bold"}>{row.created_at.toISOString()}</Text>
        <Flex gap={1} align={"center"}>
          <IconBrandTelegram size={16} stroke={""} />
          <Text fw={"lighter"} fz={"xs"}>
            {row.creator.name}
          </Text>
        </Flex>
      </td>
      <td>
        <Text fw={"bold"}>{row.updated_at.toISOString()}</Text>
        <Flex gap={1} align={"center"}>
          <IconBrandTelegram size={16} stroke={""} />
          <Text fw={"lighter"} fz={"xs"}>
            {row.updator.name}
          </Text>
        </Flex>
      </td>
      <td>
        <Menu
          // transitionProps={{ transition: "pop-top-right" }}
          // position="top-end"
          width={220}
          withinPortal
          shadow="sm"
          withArrow
        >
          <Menu.Target>
            <Button  size="xs">
              Action
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              icon={<IconPackage size="1rem" stroke={1.5} />}
              rightSection={
                <Text
                  size="xs"
                  transform="uppercase"
                  weight={700}
                  color="dimmed"
                >
                  Ctrl + P
                </Text>
              }
            >
              Project
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  return (
    <ScrollArea
      h={800}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Modal
        opened={opened}
        onClose={close}
        // withOverlay={false}
        size={"2xl"}
        // title="Creating package"
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        {currentPackage && <PackageShow package={currentPackage} />}
      </Modal>
      <Table miw={700}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Tracking Number</th>
            <th>Status</th>
            <th>Customer Name</th>
            <th>Customer City</th>
            <th>Shipper</th>
            <th>Printed</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          {rows.length <= 0 && <Box>No Data</Box>}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
