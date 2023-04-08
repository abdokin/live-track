import type { City, Package, User, WorkFlow } from "@prisma/client";
import { createObjectCsvWriter } from "csv-writer";
const user_keys = Object.keys({
  name: null,
  email: null,
  emailVerified: null,
  image: null,
  phone_number: null,
  address: null,
  cin: null,
  role: "ADMIN",
  cityId: null,
});
const city_keys = Object.keys({
  name: null,
  id: null,
  // createAt: undefined,
});
const work_flow_keys = Object.keys({
  id: null,
  name: null,
  code: null,
  style: null,
});
const package_key = Object.keys({
  id: "",
  tracking_number: "",
  reference: "",
  description: null,
  amount: 0,
  weight: 0,
  shipping_fee: 0,
  declared_value: 0,
  prof_distributed_object: false,
  fragile: false,
  check_package: false,
  printed: false,
  createdBy: "",
  updatedBy: "",
  created_at: new Date(),
  updated_at: new Date(),
  customerId: "",
  statusId: "",
  shipping_method_id: "",
  workFlowId: "",
  cityId: "",
  driverId: "",
  shipperId: "",
});
export function exportUsers(filename: string, rows: User[]) {
  if (rows.length === 0) {
    console.warn("No data to export.");
    return;
  }

  // Create a CSV writer object and specify the file path
  const csvWriter = createObjectCsvWriter({
    path: `./public/exports/${filename}.csv`,
    header: user_keys.map((key) => ({ id: key, title: key })),
  });

  // Write the data to the CSV file
  csvWriter
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .writeRecords(rows)
    .then(() => console.log(`CSV file "${filename}.csv" created successfully.`))
    .catch((err) => console.error(err));
}

export function exportCities(filename: string, rows: City[]) {
  if (rows.length === 0) {
    console.warn("No data to export.");
    return;
  }

  // Create a CSV writer object and specify the file path
  const csvWriter = createObjectCsvWriter({
    path: `./public/exports/${filename}.csv`,
    header: city_keys.map((key) => ({ id: key, title: key })),
  });

  // Write the data to the CSV file
  csvWriter
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .writeRecords(rows)
    .then(() => console.log(`CSV file "${filename}.csv" created successfully.`))
    .catch((err) => console.error(err));
}

export function exportWorkFlow(filename: string, rows: WorkFlow[]) {
  if (rows.length === 0) {
    console.warn("No data to export.");
    return;
  }

  // Create a CSV writer object and specify the file path
  const csvWriter = createObjectCsvWriter({
    path: `./public/exports/${filename}.csv`,
    header: work_flow_keys.map((key) => ({ id: key, title: key })),
  });

  // Write the data to the CSV file
  csvWriter
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .writeRecords(rows)
    .then(() => console.log(`CSV file "${filename}.csv" created successfully.`))
    .catch((err) => console.error(err));
}

export function exportPackage(filename: string, rows: Package[]) {
  if (rows.length === 0) {
    console.warn("No data to export.");
    return;
  }

  // Create a CSV writer object and specify the file path
  const csvWriter = createObjectCsvWriter({
    path: `./public/exports/${filename}.csv`,
    header: package_key.map((key) => ({ id: key, title: key })),
  });

  // Write the data to the CSV file
  csvWriter
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .writeRecords(rows)
    .then(() => console.log(`CSV file "${filename}.csv" created successfully.`))
    .catch((err) => console.error(err));
}
