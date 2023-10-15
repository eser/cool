import { assertSelector, parseHtml, withFakeServe } from "./test_utils.ts";
import { assertEquals } from "$std/assert/mod.ts";
import { createHandler } from "../server.ts";
import manifest from "./fixture/manifest.gen.ts";
import options from "./fixture/options.ts";

const handler = await createHandler(manifest, options);

// Issue: https://github.com/denoland/fresh/issues/1636
Deno.test("doesn't leak data across renderers", async () => {
  async function load(name: string) {
    const req = new Request(`http://localhost/admin/${name}`);
    const resp = await handler(req);
    const doc = parseHtml(await resp.text());

    assertSelector(doc, "#__LIME_STATE");
    const text = doc.querySelector("#__LIME_STATE")?.textContent!;
    const json = JSON.parse(text);
    assertEquals(json, { "v": [[{ "site": name }], []] });
  }

  const promises = [];
  for (let i = 0; i < 100; i++) {
    promises.push(load("foo"));
    promises.push(load("bar"));
  }
  await Promise.all(promises);
});

Deno.test("render headers passed to ctx.render()", async () => {
  await withFakeServe("./tests/fixture_render/main.ts", async (server) => {
    let res = await server.get("/header_arr");
    assertEquals(res.headers.get("x-foo"), "Hello world!");
    await res.body?.cancel();

    res = await server.get("/header_obj");
    assertEquals(res.headers.get("x-foo"), "Hello world!");
    await res.body?.cancel();

    res = await server.get("/header_instance");
    assertEquals(res.headers.get("x-foo"), "Hello world!");
    await res.body?.cancel();
  });
});
