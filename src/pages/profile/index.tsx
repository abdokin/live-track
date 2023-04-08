import { type NextPage } from "next";
import Head from "next/head";

import { LayoutDefault } from "~/components/layout_default";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Group,
  Select,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { UserInfoIcons } from "~/components/user_card";
import { useForm } from "@mantine/form";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import type { User } from "@prisma/client";
import { LoadingPage } from "~/components/Loading_page";

const Profile: NextPage = () => {
  const user = api.user.current_user.useQuery();
  const itemsBreadCrumbs = [
    { title: "Home", href: "/" },
    { title: "Profile", href: "/profile" },
  ];
  if (user.isLoading || !user.data) {
    return <LoadingPage />;
  }
  return (
    <>
      <Head>
        <title>Live Track App - {user.data.name}</title>
      </Head>
      <LayoutDefault items={itemsBreadCrumbs}>
        <Flex
          p={"lg"}
          direction={{ sm: "column", lg: "row" }}
          justify={"space-evenly"}
          maw={"2xl"}
        >
          <UserInfoIcons
            cin={user.data.cin ?? ""}
            avatar={user.data.image ?? ""}
            name={user.data.name ?? ""}
            title={user.data.role ?? ""}
            phone={user.data.phone_number ?? ""}
            email={user.data.email ?? ""}
          />
          <UserForm
            refetch={() => {
              void user.refetch();
            }}
            user={user.data}
          />
        </Flex>
      </LayoutDefault>
    </>
  );
};

export default Profile;

export function UserForm(props: {
  refetch: () => void;
  user: User;
  show_avatar?: boolean;
}) {
  const update = api.user.update.useMutation();

  const form = useForm({
    initialValues: {
      name: props.user.name ?? "",
      email: props.user.email ?? "",
      image: props.user.image ?? "",
      phone_number: props.user.phone_number ?? "",
      address: props.user.address ?? "",
      cin: props.user.cin ?? "",
      cityId: props.user.cityId ?? "",
    },
  });
  const cities = api.package.cities.useQuery();
  return (
    <Card radius="xs" w={"100%"}>
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values);
          update.mutate(
            {
              ...values,
            },
            {
              onSuccess: () => {
                toast.success(
                  JSON.stringify(update.data?.message ?? "")
                    .replace('"', " ")
                    .replace('"', " ")
                );
                props.refetch();
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
            }
          );
        })}
      >
        <Space h="xl" />
        <Group>
          {!props.show_avatar && <Text>User Info:</Text>}
          {props.show_avatar && <Avatar src={props.user.image} />}
        </Group>
        <Space h="md" />
        <Stack>
          <Group grow>
            <TextInput
              withAsterisk
              label=" Name"
              placeholder="Enter your name"
              {...form.getInputProps("name")}
            />
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Enter your email"
              {...form.getInputProps("email")}
            />
          </Group>

          <Group grow>
            <TextInput
              withAsterisk
              label=" Phone Number"
              placeholder="Enter your phone"
              {...form.getInputProps("phone_number")}
            />
            <TextInput
              withAsterisk
              label="Address"
              placeholder="Enter your address"
              {...form.getInputProps("address")}
            />
          </Group>

          <Group grow>
            <TextInput
              withAsterisk
              label="Cin"
              placeholder="Enter your cin"
              {...form.getInputProps("cin")}
            />
            {cities.data && (
              <Select
                label="City"
                placeholder="Pick one"
                disabled={cities.isLoading}
                {...form.getInputProps("cityId")}
                data={cities.data.map((it) => {
                  return {
                    value: it.id,
                    label: it.name,
                  };
                })}
              />
            )}
          </Group>
        </Stack>
        <Group position="right" mt="md">
          <Button type="submit" loading={update.isLoading}>
            Update
          </Button>
        </Group>
      </form>
    </Card>
  );
}
