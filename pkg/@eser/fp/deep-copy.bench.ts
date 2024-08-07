// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import * as jsRuntime from "@eser/standards/js-runtime";
import { deepCopy, deepCopy2 } from "./deep-copy.ts";

const group = "deep-copy";

class Dummy {
  prop: unknown;

  constructor(prop: unknown) {
    this.prop = prop;
  }
}

jsRuntime.current.bench("@eser/fp/deep-copy", { group, baseline: true }, () => {
  const obj1 = new Dummy({ value: 5 });

  deepCopy(obj1);
});

jsRuntime.current.bench("@eser/fp/deep-copy-2", { group }, () => {
  const obj1 = new Dummy({ value: 5 });

  deepCopy2(obj1);
});

jsRuntime.current.bench("structuredClone", { group }, () => {
  const obj1 = new Dummy({ value: 5 });

  structuredClone(obj1);
});
