import { asserts } from "./deps.ts";

import type {
  HexFunctionContext,
  HexFunctionInput,
  HexFunctionResult,
} from "../mod.ts";
import { execute, results } from "../mod.ts";

Deno.test("hex/functions/execute:basic", async () => {
  const fn1 = function fn1(
    input: HexFunctionInput,
    context: HexFunctionContext,
  ): HexFunctionResult {
    const to = input.parameters[0] ?? "world";
    const message = `hello ${to}`;

    return results.text(message);
  };

  const executed = await execute(fn1);

  const result1 = await executed.next();
  const result2 = await executed.next();

  asserts.assertEquals(result1, {
    value: { payload: "hello world" },
    done: false,
  });
  asserts.assertEquals(result2, { value: undefined, done: true });
});