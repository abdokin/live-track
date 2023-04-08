import { Breadcrumbs, Anchor, Box, UnstyledButton } from "@mantine/core";
import Link from "next/link";

export type BreadCrumbsItems = {
  title: string;
  href: string;
};
// BreadCrumbs
interface BreadCrumbsInterface {
  items: BreadCrumbsItems[];
}
export function BreadCrumbs(props: BreadCrumbsInterface) {
  const items = props.items.map((item, index) => (
    <Anchor href={item.href} key={index}>
      <UnstyledButton component={Link} href={item.href} > {item.title}</UnstyledButton>
    </Anchor>
  ));
  return (
    <Box py={8}>
      <Breadcrumbs>{items}</Breadcrumbs>
    </Box>
  );
}
