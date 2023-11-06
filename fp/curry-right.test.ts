// Copyright 2023 the cool authors. All rights reserved. Apache-2.0 license.

import { assert, bdd } from "../deps.ts";
import { curryRight } from "./curry-right.ts";

bdd.describe("cool/fp/curry-right", () => {
  bdd.it("basic", () => {
    const dec = (a: number, b: number) => a - b;

    const decWith5 = curryRight(dec, 5);

    const result = decWith5(3);

    assert.assertEquals(result, -2);
  });
});
