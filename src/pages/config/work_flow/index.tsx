import { type NextPage } from "next";
import Head from "next/head";

import { LayoutDefault } from "~/components/layout_default";
import {
  Box,
  Button,
  Checkbox,
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
import { type WorkFlow } from "@prisma/client";
import { useStyles } from "~/utils/table_style";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { type SetStateAction, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { LoadingPage } from "~/components/Loading_page";
import { type FormErrors, useForm } from "@mantine/form";
import { toast } from "react-hot-toast";
import { saveFileATag } from "~/utils/functions";

const UsersPage: NextPage = () => {
  const itemsBreadCrumbs = [
    { title: "Home", href: "/" },
    { title: "Config", href: "/config" },
    { title: "Work Flow", href: "/config/work_flow" },
  ];
  const [opened, { open, close }] = useDisclosure(false);
  const work_flow_create = useDisclosure(false);
  const work_flow_update = useDisclosure(false);

  const [currentWorkFlow, setCurrentWorkFlow] = useState<WorkFlow | null>();
  const [selection, setSelection] = useState<string[]>([]);
  const workflowData = api.work_flow.all.useQuery();
  const { classes, cx } = useStyles();

  const tableProps: TableComponentProps<WorkFlow> = {
    data: workflowData.data ?? [],
    rows: (callback: (id: string) => void) => {
      return workflowData.data?.map((row: WorkFlow) => {
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
              <UnstyledButton
              // onClick={() => {
              //   setCurrentPackage(row);
              //   package_show[1].open();
              // }}
              >
                <Text fw={"bold"}>{row.name}</Text>
              </UnstyledButton>
            </td>
            <td>{row.code}</td>
            <td>
              <Menu withinPortal shadow="sm" withArrow>
                <Menu.Target>
                  <Button size="xs">Action</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconEdit size="1rem" stroke={1.5} />}
                    onClick={() => {
                      setCurrentWorkFlow(row);
                      work_flow_update[1].open();
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
      { width: "250px", label: "Code" },
      { width: "150px", label: "Action" },
    ],
    selection,
    setSelection,
  };
  const exportWorkFlows = api.work_flow.export.useMutation();
  const actionProps: ActionProps = {
    selection,
    isLoading: exportWorkFlows.isLoading,
    exportCallBack: function (_ids: string[]): void {
      exportWorkFlows.mutate(undefined, {
        onSuccess: () => {
          toast.success(exportWorkFlows.data?.message ?? "");
          const fileName = exportWorkFlows.data?.path as string;
          saveFileATag(fileName);
        },
      });
    },
    globalAction: [
      {
        label: "Create WorkFlow",
        icon: <IconPlus />,
        callback: () => {
          work_flow_create[1].open();
        },
        color: "yellow",
      },
    ],

    actions: [],
  };
  if (workflowData.isLoading || !workflowData.data) {
    return <LoadingPage />;
  }

  return (
    <>
      <Head>
        <title>Live Track App - config/users</title>
      </Head>
      <Modal
        opened={work_flow_update[0]}
        onClose={work_flow_update[1].close}
        size={"2xl"}
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <UpdateWorkFlow
          refetch={() => void workflowData.refetch()}
          workFlow={currentWorkFlow}
          close={work_flow_update[1].close}
        />
      </Modal>
      <Modal
        opened={work_flow_create[0]}
        onClose={work_flow_create[1].close}
        size={"2xl"}
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <CreateWorkFlow
          refetch={() => void workflowData.refetch()}
          close={work_flow_create[1].close}
        />
      </Modal>
      <Modal
        opened={opened}
        onClose={close}
        size={"2xl"}
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        {currentWorkFlow && <Text>{currentWorkFlow.name}</Text>}
      </Modal>
      <LayoutDefault items={itemsBreadCrumbs}>
        <TableWithAction tableProps={tableProps} actionProps={actionProps} />
      </LayoutDefault>
    </>
  );
};

export default UsersPage;
function WorkFlowForm<T>(props: {
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
      <Space h="xl" />
      <Text>Recipient Info:</Text>
      <Space h="md" />
      <Stack>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Enter work flow name"
          {...form.getInputProps("name")}
        />
        <TextInput
          withAsterisk
          label="Code"
          placeholder="Enter work flow code"
          {...form.getInputProps("code")}
        />
        <TextInput
          withAsterisk
          label="Style"
          placeholder="Enter work flow style"
          {...form.getInputProps("style")}
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
const CreateWorkFlow = (props: {
  refetch: () => void;
  close: () => void;
  workFlow?: WorkFlow | null;
}) => {
  const createWorkFlow = api.work_flow.create.useMutation();
  return (
    <Box>
      <WorkFlowForm
        init_value={{
          name: "",
          code: "",
          style: "",
        }}
        isLoading={createWorkFlow.isLoading}
        callback={(values, setError) => {
          return createWorkFlow.mutate(values, {
            onSuccess: () => {
              toast.success(
                JSON.stringify(createWorkFlow.data?.message ?? "")
                  .replace('"', " ")
                  .replace('"', " ")
              );
              props.refetch();
              props.close();
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

const UpdateWorkFlow = (props: {
  refetch: () => void;
  close: () => void;
  workFlow?: WorkFlow | null;
}) => {
  const createWorkFlow = api.work_flow.update.useMutation();
  if (!props.workFlow) {
    return <Text>No work flow selected</Text>;
  }
  return (
    <Box>
      <WorkFlowForm
        init_value={props.workFlow}
        isLoading={createWorkFlow.isLoading}
        callback={(values, setError) => {
          return createWorkFlow.mutate(values, {
            onSuccess: () => {
              props.refetch();
              props.close();

              toast.success(
                JSON.stringify(createWorkFlow.data?.message ?? "")
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
