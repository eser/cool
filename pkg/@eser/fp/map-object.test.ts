// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import * as assert from "@std/assert";
import { mapObject } from "./map-object.ts";

Deno.test("basic", () => {
  const obj1 = { a: 1, b: 2, c: 3, d: 4, e: 5 };
  const func1 = (value: number, key: string | number | symbol) => ({
    [key]: value - 1,
  });

  const result = mapObject(obj1, func1);

  assert.assertNotStrictEquals(result, obj1);
  assert.assertEquals(Object.keys(result).length, 5);
  assert.assertEquals(result, { a: 0, b: 1, c: 2, d: 3, e: 4 });
});

Deno.test("with-value-skipping", () => {
  const obj1 = { a: 1, b: 2, c: null };
  const func1 = (
    value: number | null,
    key: string | number | symbol,
  ) => {
    if (value === null) {
      return null;
    }

    return { [key]: value - 1 };
  };

  const result = mapObject(obj1, func1);

  // deno-lint-ignore no-explicit-any
  assert.assertNotStrictEquals(<any> result, <any> obj1);
  assert.assertEquals(Object.keys(result).length, 2);
  assert.assertEquals(result, { a: 0, b: 1 });
});
