import { startLimeServerExpectErrors } from "./test_utils.ts";
import { dirname, join } from "$std/path/mod.ts";
import { assertStringIncludes } from "./deps.ts";
import { ServerContext } from "../server.ts";
import manifest from "./fixture/manifest.gen.ts";
import { assertEquals } from "$std/assert/mod.ts";

const dir = dirname(import.meta.url);

Deno.test({
  name: "route-conflicts",
  async fn() {
    const errorMessage = await startLimeServerExpectErrors({
      args: ["run", "-A", join(dir, "./fixture_route_analysis/dev.ts")],
    });
    assertStringIncludes(
      errorMessage,
      "Error: Route conflict detected. Multiple files have the same name",
    );
  },
});

Deno.test("match route parameter and static", async () => {
  const handler = (await ServerContext.fromManifest(manifest, {})).handler();

  const res = await handler(
    new Request("https://coollime.deno.dev/movies/foo.json"),
  );

  assertEquals(await res.text(), "it works");
  assertEquals(res.status, 200);
});

Deno.test("match multiple route parameters", async () => {
  const handler = (await ServerContext.fromManifest(manifest, {})).handler();

  const res = await handler(
    new Request("https://coollime.deno.dev/movies/foo@bar"),
  );

  assertEquals(await res.text(), "it works");
  assertEquals(res.status, 200);
});
