/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "../../server.ts";
import manifest from "./manifest.gen.ts";

function throwErr() {
  throw new Error("Error thrown");
}

await start(manifest, {
  plugins: [
    {
      name: "thrower",
      entrypoints: {
        main: `data:application/javascript,export default ${throwErr}`,
      },
      render(ctx) {
        ctx.render();
        return { scripts: [{ entrypoint: "main", state: {} }] };
      },
    },
  ],
});
