// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import * as runtime from "../standards/runtime.ts";
import { appendToArray } from "./append-to-array.ts";

const group = "append-to-array";

runtime.current.bench(
  "cool/fp/append-to-array",
  { group, baseline: true },
  () => {
    const arr1 = ["a", "b"];

    appendToArray(arr1, "c");
  },
);

runtime.current.bench("spread operator", { group }, () => {
  const arr1 = ["a", "b"];

  [...arr1, "c"];
});
