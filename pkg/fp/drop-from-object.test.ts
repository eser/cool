// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import * as assert from "@std/assert";
import { dropFromObject } from "./drop-from-object.ts";

Deno.test("basic", () => {
  const obj1 = { a: 1, b: 2, c: 3 };
  const int1 = 1;

  const result = dropFromObject(obj1, int1);

  assert.assertNotStrictEquals(result, obj1);
  assert.assertEquals(Object.keys(result).length, 2);
  assert.assertEquals(result, { b: 2, c: 3 });
});
