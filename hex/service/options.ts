import { log } from "./deps.ts";
import { type ServiceOptions } from "./types.ts";
import * as dotenv from "../../dotenv/mod.ts";

// public functions
export const createOptionsBuilder = async <
  TOptions extends ServiceOptions,
>() => {
  const options = await dotenv.configure<TOptions>(
    (env, opts) => {
      opts.port = env.readInt("PORT", 8080);
      opts.logs = env.readEnum<log.LevelName>(
        "LOGS",
        [
          "DEBUG",
          "INFO",
          "WARNING",
          "ERROR",
          "CRITICAL",
        ],
        "INFO",
      );
    },
    {},
  );

  return options;
};
