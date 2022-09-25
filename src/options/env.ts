import { dotenv } from "./deps.ts";

// inteface definitions

interface LoadEnvOptions {
  baseDir?: string;
  defaultEnvVar?: string;
  defaultEnvValue?: string;
}

interface LoadEnvResult {
  name: string;
  [key: string]: string;
}

// public functions

const loadEnvFile = async (filepath: string): Promise<dotenv.DotenvConfig> => {
  try {
    const result = dotenv.parse(
      new TextDecoder("utf-8").decode(await Deno.readFile(filepath)),
    );

    return result;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return <dotenv.DotenvConfig> {};
    }
    throw e;
  }
};

const loadEnv = async (options?: LoadEnvOptions): Promise<LoadEnvResult> => {
  const options_ = {
    baseDir: ".",
    defaultEnvVar: "ENV",
    defaultEnvValue: "development",
    ...(options ?? {}),
  };

  const sysVars = (typeof Deno !== "undefined") ? Deno.env.toObject() : {};
  const envName = sysVars[options_.defaultEnvVar] ?? options_.defaultEnvValue;

  const vars = await loadEnvFile(`${options_.baseDir}/.env`);

  Object.assign(vars, await loadEnvFile(`${options_.baseDir}/.env.${envName}`));
  if (envName !== "test") {
    Object.assign(vars, await loadEnvFile(`${options_.baseDir}/.env.local`));
  }
  Object.assign(
    vars,
    await loadEnvFile(`${options_.baseDir}/.env.${envName}.local`),
  );
  Object.assign(vars, sysVars);

  return {
    name: envName,
    ...vars,
  };
};

export { loadEnv, type LoadEnvOptions, type LoadEnvResult };
