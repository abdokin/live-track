import { Flex, Loader } from "@mantine/core";

export function LoadingPage() {
  return (
    <Flex
      justify={"center"}
      align={"center"}
      style={{
        height: "100vh",
      }}
      bg={"blue"}
    >
      <Loader size={"xl"} my="auto" color="white" />
    </Flex>
  );
}
