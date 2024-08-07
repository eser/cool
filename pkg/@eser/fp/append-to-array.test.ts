// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import * as assert from "@std/assert";
import { appendToArray } from "./append-to-array.ts";

Deno.test("basic", () => {
  const arr1 = ["a", "b"];
  const str1 = "c";

  const result = appendToArray(arr1, str1);

  assert.assertNotStrictEquals(result, arr1);
  assert.assertEquals(result.length, 3);
  assert.assertEquals(result, ["a", "b", "c"]);
});

Deno.test("with-generator", () => {
  const gen1 = function* () {
    yield "a";
    yield "b";
  };
  const str1 = "c";

  const generated1 = gen1();
  const result = appendToArray(generated1, str1);

  // deno-lint-ignore no-explicit-any
  assert.assertNotStrictEquals(<any> result, <any> generated1);
  assert.assertEquals(result.length, 3);
  assert.assertEquals(result, ["a", "b", "c"]);
});
