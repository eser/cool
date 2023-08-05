import * as environment from "@hex/environment/mod.ts";
import * as functions from "@hex/functions/mod.ts";

const _fnc = (input) => {
  const to = input.params[0] ?? "world";
  const message = `hello ${to}`;

  return functions.results.text(message);
};

// functions.dumper(
//   functions.executeFromCli(fnc),
// );

const main = async () => {
  const env = environment.environment(
    environment.cli(),
  );

  await env.dispatch("write", "Hello, world!");
};

main();
