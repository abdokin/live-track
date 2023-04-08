import { type NextPage } from "next";
import Head from "next/head";

import { LayoutDefault } from "~/components/layout_default";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Menu,
  Modal,
  Space,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  type ActionProps,
  type TableComponentProps,
  TableWithAction,
} from "~/components/table";
import { api } from "~/utils/api";
import { type City, type User } from "@prisma/client";
import { useStyles } from "~/utils/table_style";
import {
  IconPhone,
  IconBrandTelegram,
  IconAddressBook,
  IconEdit,
  IconPlus,
} from "@tabler/icons-react";
import { SetStateAction, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { UserForm } from "~/pages/profile";
import { LoadingPage } from "~/components/Loading_page";
import { FormErrors, useForm } from "@mantine/form";
import { toast } from "react-hot-toast";
import { saveFileATag } from "~/utils/functions";

const CityPage: NextPage = () => {
  const itemsBreadCrumbs = [
    { title: "Home", href: "/" },
    { title: "config", href: "/config" },
    { title: "Cities", href: "/config/city" },
  ];
  const create_city = useDisclosure(false);
  const update_city = useDisclosure(false);

  const [currentCity, setCurrentCity] = useState<City | null>();
  const [selection, setSelection] = useState<string[]>([]);
  const cityData = api.city.all.useQuery();
  const { classes, cx } = useStyles();

  const tableProps: TableComponentProps<City> = {
    data: cityData.data ?? [],
    rows: (callback: (id: string) => void) => {
      return cityData.data?.map((row: City) => {
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

            <td>
              <UnstyledButton>
                <Text fw={"bold"}>{row.name}</Text>
                {/* <Flex gap={1} align={"center"}>
                  <IconPhone size={16} stroke={""} />
                  <Text fw={"lighter"} fz={"xs"}>
                    {row.phone_number}
                  </Text>
                </Flex> */}
              </UnstyledButton>
            </td>
            <td>
              <UnstyledButton>
                <Text fw={"bold"}>{row.createAt.toISOString()}</Text>
              </UnstyledButton>
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
                      setCurrentCity(row);
                      update_city[1].open();
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
      { width: "250px", label: "Name" },
      { width: "250px", label: "Created At" },
      { width: "150px", label: "Action" },
    ],
    selection,
    setSelection,
  };
  const exportCities = api.city.export.useMutation();
  const actionProps: ActionProps = {
    selection,
    isLoading: exportCities.isLoading,
    exportCallBack: function (_ids: string[]) {
      exportCities.mutate(undefined, {
        onSuccess: () => {
          toast.success(exportCities.data?.message ?? "");
          const fileName = exportCities.data?.path as string;
          saveFileATag(fileName);
        },
      });
    },
    globalAction: [
      {
        label: "Create City",
        icon: <IconPlus />,
        callback: () => {
          create_city[1].open();
        },
        color: "yellow",
      },
    ],
    actions: [],
  };
  if (cityData.isLoading || !cityData.data) {
    return <LoadingPage />;
  }

  return (
    <>
      <Head>
        <title>Live Track App - config/users</title>
      </Head>
      <Modal
        opened={create_city[0]}
        onClose={create_city[1].close}
        size={"2xl"}
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <CreateCity
          refetch={() => void cityData.refetch()}
          close={create_city[1].close}
        />
      </Modal>
      <Modal
        opened={update_city[0]}
        onClose={update_city[1].close}
        size={"2xl"}
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <UpdateCity
          refetch={() => void cityData.refetch()}
          close={update_city[1].close}
          city={currentCity}
        />
      </Modal>

      <LayoutDefault items={itemsBreadCrumbs}>
        <TableWithAction tableProps={tableProps} actionProps={actionProps} />
      </LayoutDefault>
    </>
  );
};

export default CityPage;
function CityForm<T>(props: {
  callback: (
    values: T,
    setError: (erros: SetStateAction<FormErrors>) => void
  ) => void;
  isLoading: boolean;
  init_value: T;
}) {
  const form = useForm<T>({
    initialValues: props.init_value,
  });
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        return props.callback(values, (error) => form.setErrors(error));
      })}
    >
      <Text>City Info:</Text>
      <Space h="md" />
      <Stack>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Enter work flow name"
          {...form.getInputProps("name")}
        />
      </Stack>
      <Group position="right" mt="md">
        <Button type="submit" loading={props.isLoading}>
          Create
        </Button>
      </Group>
    </form>
  );
}

const CreateCity = (props: { refetch: () => void; close: () => void }) => {
  const create = api.city.create.useMutation();
  return (
    <Box>
      <CityForm
        init_value={{
          name: "",
        }}
        isLoading={create.isLoading}
        callback={(values, setError) => {
          return create.mutate(values, {
            onSuccess: () => {
              props.refetch();
              props.close();

              toast.success(
                JSON.stringify(create.data?.message ?? "")
                  .replace('"', " ")
                  .replace('"', " ")
              );
            },
            onError: (error) => {
              const field_errors = error.data?.zodError?.fieldErrors;
              if (!field_errors) {
                return;
              }
              // form.setErrors(field_errors);
              setError(field_errors);
              if (
                error &&
                error.data &&
                error.data.zodError &&
                error.data.zodError.fieldErrors
              ) {
                const keys = Object.keys(
                  error.data.zodError.fieldErrors
                )[0] as string;
                const firstFieldError = error.data.zodError.fieldErrors[keys];
                if (firstFieldError) {
                  toast.error(firstFieldError[0] ?? "");
                }
              }
            },
          });
        }}
      />
    </Box>
  );
};

const UpdateCity = (props: {
  refetch: () => void;
  close: () => void;
  city?: City | null;
}) => {
  const create = api.city.update.useMutation();
  if (!props.city) {
    return <Text>No City selected</Text>;
  }
  return (
    <Box>
      <CityForm
        init_value={props.city}
        isLoading={create.isLoading}
        callback={(values, setError) => {
          return create.mutate(values, {
            onSuccess: () => {
              props.refetch();
              props.close();

              toast.success(
                JSON.stringify(create.data?.message ?? "")
                  .replace('"', " ")
                  .replace('"', " ")
              );
            },
            onError: (error) => {
              const field_errors = error.data?.zodError?.fieldErrors;
              if (!field_errors) {
                return;
              }
              // form.setErrors(field_errors);
              setError(field_errors);
              if (
                error &&
                error.data &&
                error.data.zodError &&
                error.data.zodError.fieldErrors
              ) {
                const keys = Object.keys(
                  error.data.zodError.fieldErrors
                )[0] as string;
                const firstFieldError = error.data.zodError.fieldErrors[keys];
                if (firstFieldError) {
                  toast.error(firstFieldError[0] ?? "");
                }
              }
            },
          });
        }}
      />
    </Box>
  );
};
