import {
  Badge,
  Card,
  Flex,
  Stack,
  Tabs,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconMan, IconPackage, IconTrack } from "@tabler/icons-react";
import { type FullPackage } from "~/pages";

export function PackageShow(props: { package: FullPackage }) {
  return (
    <Tabs defaultValue="generale" orientation="vertical" w={"100%"}>
      <Tabs.List>
        <Tabs.Tab value="generale">
          <UnstyledButton>Geneale</UnstyledButton>
        </Tabs.Tab>
        <Tabs.Tab value="messages">Messages</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="generale" miw={"600px"}>
        <Stack miw="300px" p="xs">
          <Card title="Package Information" shadow="xl" radius={"lg"}>
            <Flex align={"center"} gap={2}>
              <IconPackage color="gray" size={18} />
              <Text fz={"lg"} fw={"bold"} color="gray" py={10}>
                Package Information
              </Text>
            </Flex>

            <DataRow
              label="Tracking Number"
              value={props.package.tracking_number}
            />

            <DataRow label="Reference" value={props.package.reference} />
            <DataRow label="WorkFlow" value={props.package.work_flow.name} />
            <DataRow label="Current Hub" value={undefined} />
            <DataRow label="Master Bag" />
            <DataRow label="Delivery run" />
            <DataRow label="Driver" value={props.package.driver.name} />
            <DataRow label="Location" />
            <DataRow
              label="Status"
              value={
                <Badge color={props.package.status.style}>
                  {props.package.status.name}
                </Badge>
              }
            />
          </Card>

          <Card title="Shippinh Information" shadow="xl" radius={"lg"}>
            <Flex align={"center"} gap={2}>
              <IconTrack color="gray" />
              <Text fz={"lg"} fw={"bold"} color="gray" py={10}>
                Shippinh Information
              </Text>
            </Flex>
            <DataRow
              label="Shipping method"
              value={props.package.shipping_method.name}
            />
            <DataRow
              label="Amount To be collecte"
              value={props.package.amount.toLocaleString()}
            />
            <DataRow
              label="Shipping Fee"
              value={props.package.shipping_fee.toLocaleString()}
            />
            <DataRow
              label="Declared Value"
              value={props.package.declared_value.toLocaleString()}
            />
            <DataRow
              label="Weight"
              value={props.package.weight.toLocaleString()}
            />
            <DataRow
              label="Proof of distributed object?"
              value={props.package.prof_distributed_object.toLocaleString()}
            />
            <DataRow
              label="Fragile?"
              value={props.package.fragile.toLocaleString()}
            />
          </Card>

          <Card title="Shippinh Information" shadow="xl" radius={"lg"}>
            <Flex align={"center"} gap={2}>
              <IconMan color="gray" />
              <Text fz={"lg"} fw={"bold"} color="gray" py={10}>
                Shipper Information
              </Text>
            </Flex>
            <DataRow label="Shipper Name" value={props.package.shipper.name} />
            <DataRow
              label="Phone Number"
              value={props.package.shipper.phone_number}
            />
            <DataRow label="Address" value={props.package.shipper.address} />
            <DataRow label="City" value={props.package.shipper.city.name} />
          </Card>

          <Card title="Recipient Information" shadow="xl" radius={"lg"}>
            <Flex align={"center"} gap={2}>
              <IconMan color="gray" />
              <Text fz={"lg"} fw={"bold"} color="gray" py={10}>
                Recipient Information
              </Text>
            </Flex>
            <DataRow
              label="Recipient Name"
              value={props.package.customer.name}
            />
            <DataRow
              label="Phone Number"
              value={props.package.customer.phone}
            />
            <DataRow label="Address" value={props.package.customer.address} />
            <DataRow label="City" value={props.package.customer.city.name} />
          </Card>
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
    </Tabs>
  );
}

function DataRow(props: {
  label: string;
  value?: JSX.Element | string | null;
}) {
  return (
    <Flex justify={"space-between"}>
      <Text>{props.label}</Text>
      <Text>{props.value ?? "Not specified"}</Text>
    </Flex>
  );
}
