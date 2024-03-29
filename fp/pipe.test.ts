// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import { assert, bdd } from "./deps-dev.ts";
import { pipe } from "./pipe.ts";

bdd.describe("cool/fp/pipe", () => {
  bdd.it("basic", () => {
    const lower = (x: string) => x.toLowerCase();
    const chars = (x: string) => x.replace(/[^\w \\-]+/g, "");
    const spaces = (x: string) => x.split(" ");
    const dashes = (x: Array<string>) => x.join("-");

    const slug = pipe(lower, chars, spaces, dashes);

    const result = slug("Hello World!");

    assert.assertEquals(result, "hello-world");
  });
});
