import { Breadcrumbs, Anchor, Box } from "@mantine/core";

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
      {item.title}
    </Anchor>
  ));
  return (
    <Box py={8}>
      <Breadcrumbs>{items}</Breadcrumbs>
    </Box>
  );
}
