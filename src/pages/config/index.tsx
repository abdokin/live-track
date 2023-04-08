import { type NextPage } from "next";
import Head from "next/head";

import { LayoutDefault } from "~/components/layout_default";
import { Box } from "@mantine/core";
import Link from "next/link";

const UsersPage: NextPage = () => {
  const itemsBreadCrumbs = [
    { title: "Home", href: "/" },
    { title: "config", href: "/config" },
  ];

  return (
    <>
      <Head>
        <title>Live Track App - config</title>
      </Head>
      <LayoutDefault items={itemsBreadCrumbs}>
        <Box>Config index</Box>
        <Link href={"/config/users"}>Users</Link>
        <Link href={"/config/work_flow"}>work Flows</Link>
        <Link href={"/config/city"}>Cities</Link>

      </LayoutDefault>
    </>
  );
};

export default UsersPage;
