import { dirname, fromFileUrl, isAbsolute, join, JSONC } from "./deps.ts";
import { FromManifestOptions, Manifest } from "./mod.ts";
import { type DenoConfig, type InternalLimeOptions } from "./types.ts";

export async function readDenoConfig(
  directory: string,
): Promise<{ config: DenoConfig; path: string }> {
  let dir = directory;
  while (true) {
    for (const name of ["deno.jsonc", "deno.json"]) {
      const path = join(dir, name);
      try {
        const file = await Deno.readTextFile(path);
        return { config: JSONC.parse(file) as DenoConfig, path };
      } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
          throw err;
        }
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(
        `Could not find a deno.json file in the current directory or any parent directory.`,
      );
    }
    dir = parent;
  }
}

function isObject(value: unknown) {
  return value !== null && typeof value === "object" &&
    !Array.isArray(value);
}

export async function getLimeConfigWithDefaults(
  manifest: Manifest,
  opts: FromManifestOptions,
): Promise<InternalLimeOptions> {
  const base = dirname(fromFileUrl(manifest.baseUrl));
  const { config: denoJson, path: denoJsonPath } = await readDenoConfig(base);

  if (typeof denoJson.importMap !== "string" && !isObject(denoJson.imports)) {
    throw new Error(
      "deno.json must contain an 'importMap' or 'imports' property.",
    );
  }

  const config: InternalLimeOptions = {
    loadSnapshot: !(opts.skipSnapshot ?? true),
    dev: opts.dev ?? false,
    denoJsonPath,
    denoJson,
    manifest,
    build: {
      outDir: "",
      target: opts.build?.target ?? ["chrome99", "firefox99", "safari15"],
    },
    plugins: opts.plugins ?? [],
    staticDir: "",
    render: opts.render,
    router: opts.router,
    server: opts.server ?? {},
  };

  if (opts.cert) {
    config.server.cert = opts.cert;
  }
  if (opts.hostname) {
    config.server.hostname = opts.hostname;
  }
  if (opts.key) {
    config.server.key = opts.key;
  }
  if (opts.onError) {
    config.server.onError = opts.onError;
  }
  if (opts.onListen) {
    config.server.onListen = opts.onListen;
  }
  if (opts.port) {
    config.server.port = opts.port;
  }
  if (opts.reusePort) {
    config.server.reusePort = opts.reusePort;
  }
  if (opts.signal) {
    config.server.signal = opts.signal;
  }

  config.build.outDir = opts.build?.outDir
    ? parseFileOrUrl(opts.build.outDir, base)
    : join(base, "_lime");

  config.staticDir = opts.staticDir
    ? parseFileOrUrl(opts.staticDir, base)
    : join(base, "static");

  return config;
}

function parseFileOrUrl(input: string, base: string) {
  if (input.startsWith("file://")) {
    return fromFileUrl(input);
  } else if (!isAbsolute(input)) {
    return join(base, input);
  }

  return input;
}
