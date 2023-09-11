import * as path from "$std/path/mod.ts";
import { puppeteer } from "./deps.ts";
import { assert, assertStringIncludes } from "$std/assert/mod.ts";
import { startLimeServer, waitForText } from "$cool/lime/tests/test_utils.ts";
import { BuildSnapshotJson } from "$cool/lime/src/build/mod.ts";

Deno.test("build snapshot and restore from it", async (t) => {
  const fixture = path.join(Deno.cwd(), "tests", "fixture_build");
  const outDir = path.join(fixture, "_lime");

  try {
    await t.step("build snapshot", async () => {
      const res = await new Deno.Command(Deno.execPath(), {
        args: [
          "run",
          "-A",
          path.join(fixture, "dev.ts"),
          "build",
        ],
        env: {
          GITHUB_SHA: "__BUILD_ID__",
          DENO_DEPLOYMENT_ID: "__BUILD_ID__",
        },
        stdin: "null",
        stdout: "piped",
        stderr: "inherit",
      }).output();

      const decoder = new TextDecoder();
      const stdout = decoder.decode(res.stdout);
      assert(
        !/Using snapshot found at/.test(stdout),
        "Using snapshot message was shown during build",
      );

      assert((await Deno.stat(outDir)).isDirectory, "Missing output directory");
    });

    const snapshot = JSON.parse(
      await Deno.readTextFile(path.join(outDir, "snapshot.json")),
    ) as BuildSnapshotJson;

    await t.step("check snapshot file", () => {
      assert(
        Array.isArray(snapshot.files["island-counter_default.js"]),
        "Island output file not found in snapshot",
      );
      assert(
        Array.isArray(snapshot.files["main.js"]),
        "main.js output file not found in snapshot",
      );
      assert(
        Array.isArray(snapshot.files["signals.js"]),
        "signals.js output file not found in snapshot",
      );
      assert(
        Array.isArray(snapshot.files["deserializer.js"]),
        "deserializer.js output file not found in snapshot",
      );
    });

    await t.step("restore from snapshot", async () => {
      const { lines, serverProcess, address, output } = await startLimeServer({
        args: [
          "run",
          "-A",
          path.join(fixture, "./main.ts"),
        ],
      });

      // Check if restore snapshot message was printed
      assert(
        output.find((line) => line.includes("Using snapshot found at")),
        "Did not print restoring from snapshot line",
      );

      try {
        const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

        try {
          const page = await browser.newPage();
          await page.goto(address);

          await page.waitForSelector("button:not([disabled])");
          await page.click("button");

          await waitForText(page, "p", "1");

          // Ensure that it uses the build id from the snapshot
          const assetUrls = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll("link")).map(
              (link) => link.href,
            );
            const scripts = Array.from(document.querySelectorAll("script"))
              .filter((script) =>
                script.src && !script.src.endsWith("refresh.js")
              ).map((script) => script.src);

            return [...links, ...scripts];
          });

          for (let i = 0; i < assetUrls.length; i++) {
            assertStringIncludes(assetUrls[i], snapshot.build_id);
          }
        } finally {
          await browser.close();
        }
      } finally {
        await lines.cancel();
        serverProcess.kill("SIGTERM");
        await serverProcess.status;
      }
    });
  } finally {
    await Deno.remove(path.join(fixture, "_lime"), { recursive: true });
  }
});
