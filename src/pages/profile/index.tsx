import { type NextPage } from "next";
import Head from "next/head";

import { LayoutDefault } from "~/components/layout_default";
import { Box, Text } from "@mantine/core";
import { useSession } from "next-auth/react";

const Profile: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Live Track App - {sessionData?.user.name}</title>
      </Head>
      <LayoutDefault>
        <Box>
          <Text>Welcome {sessionData?.user.name}</Text>
        </Box>
      </LayoutDefault>
    </>
  );
};

export default Profile;
