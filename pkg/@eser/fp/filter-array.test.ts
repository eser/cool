// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import * as assert from "@std/assert";
import { filterArray } from "./filter-array.ts";

Deno.test("basic", () => {
  const arr1 = [1, 2, 3, 4, 5];
  const func1 = (x: number) => x <= 3;

  const result = filterArray(arr1, func1);

  assert.assertNotStrictEquals(result, arr1);
  assert.assertEquals(result.length, 3);
  assert.assertEquals(result, [1, 2, 3]);
});

Deno.test("with-generator", () => {
  const gen1 = function* () {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
  };
  const func1 = (x: number) => x <= 3;

  const generated1 = gen1();
  const result = filterArray(generated1, func1);

  // deno-lint-ignore no-explicit-any
  assert.assertNotStrictEquals(<any> result, <any> generated1);
  assert.assertEquals(result.length, 3);
  assert.assertEquals(result, [1, 2, 3]);
});
