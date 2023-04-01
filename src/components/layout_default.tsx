import {
  AppShell,
  Navbar,
  Header,
  Aside,
  MediaQuery,
  Text,
  useMantineTheme,
  Footer,
  Burger,
  NavLink,
  Box,
  Container,
} from "@mantine/core";
import Link from "next/link";
import { IconHome2 } from "@tabler/icons-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { HeaderTabs } from "./header";
import { useSession } from "next-auth/react";
import { NavbarMinimal } from "./navbar";
export function LayoutDefault(props: { children: ReactNode }) {
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
        <Header height={{ base: 50, md: 70 }} zIndex={1000}   p="md">
          <HeaderTabs
            user={{
              name: sessionData?.user.name ?? "",
              image: sessionData?.user.image ?? "",
            }}
          />
        </Header>
      }
    >
      <Container size={'2xl'}>
      {props.children}
      </Container>
    </AppShell>
  );
}
