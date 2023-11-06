// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { join, relative, semver, walk, WalkEntry } from "./deps.ts";
export { generate, type Manifest } from "./manifest.ts";
import { generate, type Manifest } from "./manifest.ts";
import { error } from "./error.ts";

const MIN_DENO_VERSION = "1.38.0";
const TEST_FILE_PATTERN = /[._]test\.(?:[tj]sx?|[mc][tj]s)$/;

export function ensureMinDenoVersion() {
  // Check that the minimum supported Deno version is being used.
  if (
    !semver.gte(semver.parse(Deno.version.deno), semver.parse(MIN_DENO_VERSION))
  ) {
    let message =
      `Deno version ${MIN_DENO_VERSION} or higher is required. Please update Deno.\n\n`;

    if (Deno.execPath().includes("homebrew")) {
      message +=
        "You seem to have installed Deno via homebrew. To update, run: `brew upgrade deno`\n";
    } else {
      message += "To update, run: `deno upgrade`\n";
    }

    error(message);
  }
}

async function collectDir(
  dir: string,
  callback: (entry: WalkEntry, dir: string) => void,
  ignoreFilePattern = TEST_FILE_PATTERN,
): Promise<void> {
  // Check if provided path is a directory
  try {
    const stat = await Deno.stat(dir);
    if (!stat.isDirectory) {
      return;
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return;
    }

    throw err;
  }

  const routesFolder = walk(dir, {
    includeDirs: false,
    includeFiles: true,
    exts: ["tsx", "jsx", "ts", "js"],
    skip: [ignoreFilePattern],
  });

  for await (const entry of routesFolder) {
    callback(entry, dir);
  }
}

const GROUP_REG = /[/\\\\]\((_[^/\\\\]+)\)[/\\\\]/;
export async function collect(
  directory: string,
  ignoreFilePattern?: RegExp,
): Promise<Manifest> {
  const filePaths = new Set<string>();

  const routes: Array<string> = [];
  const islands: Array<string> = [];
  await Promise.all([
    collectDir(join(directory, "./routes"), (entry, dir) => {
      const rel = join("routes", relative(dir, entry.path));
      const normalized = rel.slice(0, rel.lastIndexOf("."));

      // A `(_islands)` path segment is a local island folder.
      // Any route path segment wrapped in `(_...)` is ignored
      // during route collection.
      const match = normalized.match(GROUP_REG);
      if (match !== null && match[1]?.startsWith("_") === true) {
        if (match[1] === "_islands") {
          islands.push(rel);
        }
        return;
      }

      if (filePaths.has(normalized)) {
        throw new Error(
          `Route conflict detected. Multiple files have the same name: ${dir}${normalized}`,
        );
      }
      filePaths.add(normalized);
      routes.push(rel);
    }, ignoreFilePattern),
    collectDir(join(directory, "./islands"), (entry, dir) => {
      const rel = join("islands", relative(dir, entry.path));
      islands.push(rel);
    }, ignoreFilePattern),
  ]);

  routes.sort();
  islands.sort();

  return { routes, islands };
}

export async function buildManifestFile(base: string) {
  const manifest = await collect(base);
  await generate(base, manifest);

  console.log(
    `%cThe manifest has been generated for ${manifest.routes.length} routes and ${manifest.islands.length} islands.`,
    "color: blue; font-weight: bold",
  );

  // return manifest;
}
