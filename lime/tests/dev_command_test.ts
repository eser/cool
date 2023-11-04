import { assert, assertEquals, assertStringIncludes } from "./deps.ts";
import { Status } from "../server.ts";
import {
  assertNotSelector,
  assertSelector,
  assertTextMany,
  assertTextMatch,
  fetchHtml,
  waitForStyle,
  withFakeServe,
  withLime,
  withPageName,
} from "./test_utils.ts";

Deno.test({
  name: "dev_command config",
  async fn() {
    await withPageName(
      "./tests/fixture_dev_config/main.ts",
      async (page, address) => {
        await page.goto(`${address}`);
        await waitForStyle(page, "h1", "color", "rgb(220, 38, 38)");
      },
    );
  },
});

Deno.test({
  name: "dev_command bundle assets",
  async fn() {
    await withPageName(
      "./tests/fixture_dev_config/dev.ts",
      async (page, address) => {
        const logs: Array<string> = [];
        page.on("console", (msg) => logs.push(msg.text()));
        await page.goto(`${address}`, { waitUntil: "networkidle2" });
        await waitForStyle(page, "h1", "color", "rgb(220, 38, 38)");
        assert(
          !logs.some((msg) => /Failed to load resource/.test(msg)),
          `Error loading bundle assets`,
        );
      },
    );
  },
});

Deno.test({
  name: "dev_command config: shows codeframe",
  async fn() {
    await withFakeServe(
      "./tests/fixture_dev_config/dev.ts",
      async (server) => {
        const doc = await server.getHtml("/codeframe");
        assertSelector(doc, ".lime-error-page");
        assertSelector(doc, ".code-frame");
      },
    );
  },
});

Deno.test("preact/debug is active in dev mode", async () => {
  await withFakeServe(
    "./tests/fixture_render_error/dev.ts",
    async (server) => {
      // SSR error is shown
      const resp = await server.get("/");
      const text = await resp.text();

      assertEquals(resp.status, Status.InternalServerError);
      assertStringIncludes(text, "Objects are not valid as a child");

      const html = await server.getHtml("/");

      // Error page is shown with error message
      const text2 = html.querySelector(".lime-error-page")!.textContent!;

      assertStringIncludes(text2, "Objects are not valid as a child");
    },
  );
});

Deno.test("warns when using hooks in server components", async (t) => {
  await withFakeServe("./tests/fixture/main.ts", async (server) => {
    await t.step("useState", async () => {
      const doc = await server.getHtml("/hooks-server/useState");
      assertTextMatch(doc, "p", /Hook "useState" cannot be used/);
      // Check for hint
      assertTextMatch(doc, "p", /Instead, use the "useSignal" hook/);
    });

    await t.step("useReducer", async () => {
      const doc = await server.getHtml("/hooks-server/useReducer");
      assertTextMatch(doc, "p", /Hook "useReducer" cannot be used/);
    });

    // Valid
    await t.step("does not warn in island", async () => {
      const doc = await server.getHtml("/hooks-server/island");
      assertTextMany(doc, "p", ["0"]);
    });
  });
});

Deno.test("shows custom 500 page for rendering errors when not in dev", async (t) => {
  await withLime({
    name: "./tests/fixture/main.ts",
    options: {
      env: {
        DENO_DEPLOYMENT_ID: "foo",
      },
    },
  }, async (address) => {
    await t.step("useState", async () => {
      const doc = await fetchHtml(`${address}/hooks-server/useState`);
      assertNotSelector(doc, "pre");
    });

    await t.step("useReducer", async () => {
      const doc = await fetchHtml(`${address}/hooks-server/useReducer`);
      assertNotSelector(doc, "pre");
    });
  });
});

Deno.test("show codeframe in dev mode even with custom 500", async () => {
  await withFakeServe(
    "./tests/fixture_dev_codeframe/dev.ts",
    async (server) => {
      const doc = await server.getHtml(`/`);
      assertSelector(doc, ".lime-error-page");
    },
  );

  await withFakeServe(
    "./tests/fixture_dev_codeframe/main.ts",
    async (server) => {
      const doc = await server.getHtml(`/`);
      assertNotSelector(doc, ".lime-error-page");
      assertSelector(doc, "h1");
    },
  );
});
