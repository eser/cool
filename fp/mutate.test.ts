// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import { assert, bdd } from "./deps-dev.ts";
import { mutate } from "./mutate.ts";

bdd.describe("cool/fp/mutate", () => {
  bdd.it("basic", () => {
    const obj1 = {
      firstName: "Eser",
      lastName: "Ozvataf",
      aliases: [],
    };

    const result = mutate(obj1, (x) => x.firstName = "Helo");

    assert.assertNotStrictEquals(result, obj1);
    assert.assertEquals(Object.keys(result).length, 3);
    assert.assertEquals(
      result,
      {
        firstName: "Helo",
        lastName: "Ozvataf",
        aliases: [],
      },
    );
  });

  bdd.it("array-push", () => {
    const obj1 = {
      firstName: "Eser",
      lastName: "Ozvataf",
      aliases: <Array<string>> [],
    };

    const result = mutate(obj1, (x) => {
      x.firstName = "Helo";

      x.aliases.push("laroux");
    });

    assert.assertNotStrictEquals(result, obj1);
    assert.assertEquals(Object.keys(result).length, 3);
    assert.assertEquals(
      result,
      {
        firstName: "Helo",
        lastName: "Ozvataf",
        aliases: [
          "laroux",
        ],
      },
    );
  });

  bdd.it("with-class", () => {
    class dummy {
      items: Array<string>;

      constructor() {
        this.items = [];
      }
    }

    const obj1 = new dummy();

    const result = mutate(obj1, (x) => {
      x.items.push("laroux");
    });

    assert.assertNotStrictEquals(result, obj1);
    assert.assertEquals(result.constructor, dummy);
    assert.assertEquals(Object.keys(result), ["items"]);
    assert.assertEquals(
      result.items,
      [
        "laroux",
      ],
    );
  });
});
