import {
  Box,
  Space,
  Stack,
  Group,
  TextInput,
  Select,
  NumberInput,
  Checkbox,
  Button,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Prisma } from "@prisma/client";
import toast from "react-hot-toast";
import { Primitive } from "zod";
import { api } from "~/utils/api";

export function CreatePackage(props: {
  close: () => void;
  refetch: () => void;
}) {
  const form = useForm({
    initialValues: {
      reference: "",
      amount: 0,
      declared_value: 0,
      check_package: false,
      description: "",
      prof_distributed_object: "false",
      fragile: "false",
      weight: 0,
      shipping_method_id: "",
      customer_name: "",
      customer_email: "",
      customer_city: "",
      customer_cin: "",
      customer_phone: "",
      customer_address: "",
      customer_city_id: "",
      city_id: "",
    },
    transformValues: (values) => {
      return {
        ...values,
        fragile: Boolean(values.fragile),
        prof_distributed_object: Boolean(values.prof_distributed_object),
      };
    },
    // transformValues:,
    validate: {
      weight: (value) => (value < 0 ? "Weight min 0" : null),
      amount: (value) => (value < 0 ? "Amount min 0" : null),
    },
  });
  const createPackage = api.package.create.useMutation();
  const shipping_method = api.package.shipping_method.useQuery();
  const cities = api.package.cities.useQuery();

  return (
    <Box w="full">
      <form
        onSubmit={form.onSubmit((values) => {
          createPackage.mutate(values, {
            onSuccess: () => {
              toast.success(
                JSON.stringify(createPackage.data?.message ?? "")
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
              form.setErrors(field_errors);
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
        })}
      >
        <Space h="xl" />
        <Text>Recipient Info:</Text>
        <Space h="md" />
        <Stack>
          <Group grow>
            <TextInput
              withAsterisk
              label="Recipient Name"
              placeholder="Enter recipient name"
              {...form.getInputProps("customer_name")}
            />
            <TextInput
              withAsterisk
              label="Recipient Phone Number"
              placeholder="Enter recipient phone"
              {...form.getInputProps("customer_phone")}
            />
            <TextInput
              withAsterisk
              label="Recipient Address"
              placeholder="Enter recipient Address"
              {...form.getInputProps("customer_address")}
            />
          </Group>
          <Group grow>
            <TextInput
              withAsterisk
              label="Recipient City"
              placeholder="Enter recipient city"
              {...form.getInputProps("customer_city")}
            />
            <TextInput
              label="Recipient Email"
              placeholder="Enter recipient email"
              {...form.getInputProps("customer_email")}
            />
            <TextInput
              label="Recipient CIN"
              placeholder="Enter recipient CIN"
              {...form.getInputProps("customer_cin")}
            />
          </Group>
          <Group>
            {cities.data && (
              <Select
                label="Recipient City"
                placeholder="Pick one"
                disabled={cities.isLoading}
                {...form.getInputProps("customer_city_id")}
                data={
                  cities.data.map((it) => {
                    return {
                      value: it.id,
                      label: it.name,
                    };
                  }) ?? []
                }
              />
            )}
          </Group>
        </Stack>
        <Space h="xl" />
        <Text>Package Info:</Text>
        <Space h="md" />
        <Stack>
          <Group grow>
            <TextInput
              withAsterisk
              label="Reference"
              placeholder="your package reference"
              {...form.getInputProps("reference")}
            />
            <NumberInput
              min={0}
              withAsterisk
              label="Amount To be collected"
              placeholder="0"
              {...form.getInputProps("amount")}
            />
            {shipping_method.data && (
              <Select
                label="Shipping Method"
                placeholder="Pick one"
                disabled={shipping_method.isLoading}
                {...form.getInputProps("shipping_method_id")}
                data={shipping_method.data.map((it) => {
                  return {
                    value: it.id,
                    label: it.name,
                  };
                })}
              />
            )}
            <NumberInput
              min={0}
              withAsterisk
              label="Declared Value"
              placeholder="0"
              {...form.getInputProps("declared_value")}
            />
          </Group>
          <Group grow py={10}>
            <Select
              label="Prof distributed Object"
              placeholder="Pick one"
              {...form.getInputProps("prof_distributed_object")}
              data={[
                { value: "false", label: "YES" },
                { value: "true", label: "NO" },
              ]}
            />
            <Select
              label="Fragile"
              placeholder="Pick one"
              {...form.getInputProps("fragile")}
              data={[
                { value: "false", label: "YES" },
                { value: "true", label: "NO" },
              ]}
            />
            <NumberInput
              withAsterisk
              label="Weight"
              min={0}
              placeholder="0"
              {...form.getInputProps("weight")}
            />
            <TextInput
              label="Product Description"
              placeholder="product Description"
              {...form.getInputProps("description")}
            />
          </Group>
          <Group>
            {cities.data && (
              <Select
                label="Package City"
                placeholder="Pick one"
                disabled={cities.isLoading}
                {...form.getInputProps("city_id")}
                data={
                  cities.data.map((it) => {
                    return {
                      value: it.id,
                      label: it.name,
                    };
                  }) ?? []
                }
              />
            )}
          </Group>
        </Stack>

        <Checkbox
          mt="md"
          label="Can the recipient check the package before paying?"
          {...form.getInputProps("check_package", { type: "checkbox" })}
        />
        <Group position="right" mt="md">
          <Button type="submit" loading={createPackage.isLoading}>
            Create
          </Button>
        </Group>
      </form>
    </Box>
  );
}
