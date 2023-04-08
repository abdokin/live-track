import { type NextPage } from "next";
import Head from "next/head";

import { LayoutDefault } from "~/components/layout_default";
import {
  Avatar,
  Button,
  Checkbox,
  Flex,
  Menu,
  Modal,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  type ActionProps,
  type TableComponentProps,
  TableWithAction,
} from "~/components/table";
import { api } from "~/utils/api";
import { type User } from "@prisma/client";
import { useStyles } from "~/utils/table_style";
import {
  IconPhone,
  IconBrandTelegram,
  IconAddressBook,
  IconEdit,
} from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { UserForm } from "~/pages/profile";
import { LoadingPage } from "~/components/Loading_page";
import { toast } from "react-hot-toast";

const UsersPage: NextPage = () => {
  const itemsBreadCrumbs = [
    { title: "Home", href: "/" },
    { title: "config", href: "/config" },
    { title: "users", href: "/config/users" },
  ];
  const [opened, { open, close }] = useDisclosure(false);
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [selection, setSelection] = useState<string[]>([]);
  const usersData = api.user.all_users.useQuery();
  const { classes, cx } = useStyles();
  const exportUsers = api.user.export.useMutation();
  const tableProps: TableComponentProps<User> = {
    data: usersData.data ?? [],
    rows: (callback: (id: string) => void) => {
      return usersData.data?.map((row: User) => {
        return (
          <tr
            key={row.id}
            className={cx({
              [classes?.rowSelected]: selection.includes(row.id),
            })}
          >
            <td>
              <Checkbox
                checked={selection.includes(row.id)}
                onChange={() => callback(row.id)}
                transitionDuration={0}
              />
            </td>
            <th>
              <Avatar src={row.image} radius={"xl"} size={"md"} />
            </th>
            <td>
              <UnstyledButton
              // onClick={() => {
              //   setCurrentPackage(row);
              //   package_show[1].open();
              // }}
              >
                <Text fw={"bold"}>{row.name}</Text>
                <Flex gap={1} align={"center"}>
                  <IconPhone size={16} stroke={""} />
                  <Text fw={"lighter"} fz={"xs"}>
                    {row.phone_number}
                  </Text>
                </Flex>
              </UnstyledButton>
            </td>
            <td>
              <Text fw={"bold"}>{row.address}</Text>
              <Flex gap={1} align={"center"}>
                <IconAddressBook size={16} stroke={""} />
                <Text fw={"lighter"} fz={"xs"}>
                  {row.cityId}
                </Text>
              </Flex>
            </td>
            <td>
              <Text fw={"bold"}>{row.cin}</Text>
              <Flex gap={1} align={"center"}>
                <IconBrandTelegram size={16} stroke={""} />
                <Text fw={"lighter"} fz={"xs"}>
                  {row.role}
                </Text>
              </Flex>
            </td>

            <td>
              <Menu withinPortal shadow="sm" withArrow>
                <Menu.Target>
                  <Button size="xs">Action</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconEdit size="1rem" stroke={1.5} />}
                    onClick={() => {
                      setCurrentUser(row);
                      open();
                    }}
                  >
                    Edit
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </td>
          </tr>
        );
      });
    },
    heads: [
      { width: "100px", label: "Avatar" },
      { width: "250px", label: "Name" },
      { width: "100px", label: "Address" },
      { width: "150px", label: "Cin" },
      { width: "150px", label: "Action" },
    ],
    selection,
    setSelection,
  };
  const actionProps: ActionProps = {
    selection,
    isLoading: exportUsers.isLoading,
    exportCallBack: function (_ids: string[]) {
      exportUsers.mutate(undefined, {
        onSuccess: () => {
          toast.success("Users Exported");
          const fileName = exportUsers.data?.path;
         
        },
      });
    },
    globalAction: [],
    actions: [],
  };
  if (usersData.isLoading || !usersData.data) {
    return <LoadingPage />;
  }

  return (
    <>
      <Head>
        <title>Live Track App - config/users</title>
      </Head>
      <Modal
        opened={opened}
        onClose={close}
        size={"2xl"}
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        {currentUser && (
          <UserForm
            show_avatar={true}
            refetch={() => {
              close();
              void usersData.refetch();
            }}
            user={currentUser}
          />
        )}
      </Modal>
      <LayoutDefault items={itemsBreadCrumbs}>
        <TableWithAction tableProps={tableProps} actionProps={actionProps} />
      </LayoutDefault>
    </>
  );
};

export default UsersPage;
