import { Box } from "@mantine/core";
import type { Package } from "@prisma/client";

export function PackageShow(props: { package: Package }) {
  return <Box>{props.package.tracking_number}</Box>;
}
