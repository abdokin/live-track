import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { LayoutDefault } from "~/components/layout_default";
import {
  type ActionProps,
  type TableComponentProps,
  TableWithAction,
} from "~/components/table";
import type {
  City,
  Customer,
  Package,
  Package_History,
  ShipmentProvider,
  Status,
  User,
  WorkFlow,
} from "@prisma/client";
import { useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  Menu,
  Modal,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconPackage,
  IconPhone,
  IconBrandTelegram,
  IconPrinter,
  IconPlus,
  IconTicket,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { CreatePackage } from "~/components/create_package";
import { PackageShow } from "~/components/package_show";
import { useStyles } from "~/utils/table_style";
import { LoadingPage } from "~/components/Loading_page";
export type FullPackage = Package & {
  status: Status;
  customer: Customer & {
    city: City & {
      shipmentProvider: ShipmentProvider | null;
    };
  };
  work_flow: WorkFlow;
  driver: User;
  shipper: User & {
    city: City | null;
  };
  shipping_method: WorkFlow;
  creator: User;
  updator: User;
  history: Package_History[];
};

const Home: NextPage = () => {
  const packages = api.package.all_packages.useQuery();
  const itemsBreadCrumbs = [
    { title: "Home", href: "/" },
    { title: "packages", href: "/" },
  ];
  const [selection, setSelection] = useState<string[]>([]);
  const { classes, cx } = useStyles();
  const [currentPackage, setCurrentPackage] = useState<FullPackage | null>(
    null
  );
  const [opened, { open, close }] = useDisclosure(false);
  const package_show = useDisclosure(false);

  const tableProps: TableComponentProps<FullPackage> = {
    data: packages.data ?? [],
    rows: (callback: (id: string) => void) => {
      return packages.data?.map((row: FullPackage) => {
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
                onClick={() => {
                  setCurrentPackage(row);
                  package_show[1].open();
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
                  {row.customer.city.shipmentProvider?.name ?? "Not specified"}
                </Text>
              </Flex>
            </td>
            <td>
              <Text fw={"bold"}>{row.shipper.name}</Text>
              <Flex gap={1} align={"center"}>
                <IconBrandTelegram size={16} stroke={""} />
                <Text fw={"lighter"} fz={"xs"}>
                  {row.shipper.phone_number}
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
              <Menu withinPortal shadow="sm" withArrow>
                <Menu.Target>
                  <Button size="xs">Action</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconTicket size="1rem" stroke={1.5} />}
                    onClick={() => {
                      throw new Error("NOT IMPLEMENTED");
                    }}
                  >
                    Get Label
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </td>
          </tr>
        );
      });
    },
    heads: [
      { width: "250px", label: "Tracking Number" },
      { width: "100px", label: "Status" },
      { width: "150px", label: "Customer Name" },
      { width: "150px", label: "Customer City" },
      { width: "150px", label: "Shipper" },
      { width: "100px", label: "Printed" },
      { width: "150px", label: "Created At" },
      { width: "150px", label: "Updated At" },
      { width: "150px", label: "Action" },
    ],
    selection,
    setSelection,
  };
  const actionProps: ActionProps = {
    selection,
    isLoading: false,
    exportCallBack: function (_ids: string[]): void {
      throw new Error("Function not implemented.");
    },
    globalAction: [
      {
        label: "create package",
        icon: <IconPlus stroke={1.1} />,
        color: "yellow",
        callback: () => {
          open();
        },
      },
    ],
    actions: [
      {
        label: "Get Label",
        icon: <IconTicket stroke={1.1} />,
        callback: (ids) => {
          alert(ids);
          throw new Error("Function not implemented.");
        },
      },
    ],
  };
  // if (packages.isLoading || !packages.data) {
  //   return <LoadingPage />;
  // }

  return (
    <>
      <Head>
        <title>Live Track App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutDefault items={itemsBreadCrumbs}>
        <Modal
          opened={package_show[0]}
          onClose={package_show[1].close}
          // withOverlay={false}
          size={"2xl"}
          // title="Creating package"
          overlayProps={{ opacity: 0.5, blur: 4 }}
        >
          <Modal.Body>
            {currentPackage && <PackageShow package={currentPackage} />}
          </Modal.Body>
        </Modal>
        <Modal
          opened={opened}
          onClose={close}
          size={"2xl"}
          overlayProps={{ opacity: 0.5, blur: 4 }}
        >
          <CreatePackage
            close={close}
            refetch={() => {
              void packages.refetch();
            }}
          />
        </Modal>
        <TableWithAction tableProps={tableProps} actionProps={actionProps} />
      </LayoutDefault>
    </>
  );
};

export default Home;
