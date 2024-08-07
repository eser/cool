// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import * as assert from "@std/assert";
import { distinctArray } from "./distinct-array.ts";

Deno.test("basic", () => {
  const arr1 = [
    { id: 1, name: "foo", parent: 0 },
    { id: 2, name: "bar", parent: 1 },
    { id: 3, name: "baz", parent: 1 },
  ];
  const func1 = (item: { parent: number }) => item.parent;

  const result = distinctArray(arr1, func1);

  assert.assertNotStrictEquals(result, arr1);
  assert.assertEquals(Object.keys(result).length, 2);
  assert.assertEquals(result, [
    { id: 1, name: "foo", parent: 0 },
    { id: 2, name: "bar", parent: 1 },
  ]);
});
