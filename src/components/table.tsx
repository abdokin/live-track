import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  rem,
  Text,
  UnstyledButton,
  Button,
  Menu,
  Group,
  Checkbox,
  Stack,
  Space,
  Card,
  Center,
} from "@mantine/core";

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
type DataType<T> = T & {
  id: string;
};

export interface TableComponentProps<T> {
  data: DataType<T>[];
  rows: (toggleRow: (id: string) => void) => JSX.Element[] | undefined;
  heads: {
    label: string;
    width: string;
  }[];
  selection: string[];
  setSelection: Dispatch<SetStateAction<string[]>>;
}

export function TableComponent<T>({
  data,
  rows,
  heads,
  setSelection,
  selection,
}: TableComponentProps<T>) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      current.length === data.length ? [] : data.map((item) => item?.id)
    );

  return (
    <ScrollArea
      h={800}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table miw={700}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={
                  selection.length > 0 && selection.length !== data.length
                }
                transitionDuration={0}
              />
            </th>
            {heads.map((it) => {
              return (
                <th key={it.label} style={{ minWidth: it.width }}>
                  {it.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{rows(toggleRow)}</tbody>
        {rows.length <= 0 && (
          <Text>
            <Center>No Data</Center>
          </Text>
        )}
      </Table>
    </ScrollArea>
  );
}
export interface ActionProps {
  selection: string[];
  isLoading: boolean;
  exportCallBack: (ids: string[]) => void;
  globalAction: {
    label: string;
    icon: ReactNode;
    color: string;
    callback: () => void;
  }[];
  actions: {
    label: string;
    icon: ReactNode;
    callback: (ids: string[]) => void;
  }[];
}

function ActionsComponent(props: ActionProps) {
  return (
    <>
      <Group position="right">
        <Button
          color="cyan"
          onClick={() => {
            props.exportCallBack(props.selection);
          }}
          loading={props.isLoading}
        >
          Export
        </Button>
        {props.globalAction.map((it) => {
          return (
            <Button
              key={it.label}
              onClick={() => it.callback()}
              color={it.color}
            >
              {it.label}
            </Button>
          );
        })}
        <Button>Filters</Button>
        {props.actions.length > 0 && (
          <Menu shadow="lg" width={150} withArrow withinPortal>
            <Menu.Target>
              <Button color="dark" disabled={props.selection.length == 0}>
                Action
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {props.actions.map((action) => {
                return (
                  <Menu.Item key={action.label} rightSection={action.icon}>
                    <UnstyledButton
                      onClick={() => {
                        action.callback(props.selection);
                      }}
                    >
                      {action.label}
                    </UnstyledButton>
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </>
  );
}

export function TableWithAction<T>(props: {
  tableProps: TableComponentProps<T>;
  actionProps: ActionProps;
}) {
  return (
    <Card>
      <ActionsComponent {...props.actionProps} />
      <Space h="sm" />
      <Stack
        style={{
          overflowX: "scroll",
          position: "relative",
        }}
      >
        {/* <LoadingOverlay
          visible={props.packages.isLoading || props.packages.isRefetching}
          overlayBlur={2}
        /> */}

        {props.tableProps.data && <TableComponent {...props.tableProps} />}
      </Stack>
    </Card>
  );
}
