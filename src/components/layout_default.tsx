import {
  AppShell,
  Header,
  useMantineTheme,
  Footer,
  Container,
  Stack,
} from "@mantine/core";
import type { ReactNode } from "react";
import { HeaderTabs } from "./header";
import { useSession } from "next-auth/react";
import { NavbarMinimal } from "./navbar";
import { BreadCrumbs } from "./breadcrumbs";
import type { BreadCrumbsItems } from "./breadcrumbs";
export function LayoutDefault(props: {
  children: ReactNode;
  items: BreadCrumbsItems[];
}) {
  const theme = useMantineTheme();
  const { data: sessionData } = useSession();
  return (
    <AppShell
      padding="md"
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<NavbarMinimal />}
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }}>
          <HeaderTabs
            user={{
              name: sessionData?.user.name ?? "",
              image: sessionData?.user.image ?? "",
            }}
          />
        </Header>
      }
    >
      <Container size={"2xl"}>
        <BreadCrumbs items={props.items} />
        <Stack pt={8}>{props.children}</Stack>
      </Container>
    </AppShell>
  );
}
