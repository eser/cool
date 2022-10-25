import {
  type Command,
  CommandType,
  ValueType,
  execute,
  ExecuteOptions,
  showHelp,
  showVersion,
} from "./src/cli/mod.ts";
import { create } from "./src/generator/create.ts";
import metadata from "./src/metadata.json" assert { type: "json" };

const upgradeCli = async (args: string[], options: ExecuteOptions) => {
  const p = Deno.run({
    cmd: ["deno", "install", "-A", "-r", "-f", "https://deno.land/x/hex/hex.ts"],
    stdout: "inherit",
    stderr: "inherit",
    stdin: "null",
  });

  await p.status();
};

const run = async (args: string[], options: ExecuteOptions) => {
  const p = Deno.run({
    cmd: ["deno", "run", "-A", "--unstable", "src/main.ts", ...args],
    stdout: "inherit",
    stderr: "inherit",
    stdin: "null",
  });

  await p.status();
};

const test = async (args: string[], options: ExecuteOptions) => {
  const p = Deno.run({
    cmd: ["deno", "task", "test"],
    stdout: "inherit",
    stderr: "inherit",
    stdin: "null",
  });

  await p.status();
};

const hexCli = async () => {
  const executeOptions: ExecuteOptions = {
    command: "hex",
    module: import.meta.url,
  };

  const commands: Command[] = [
    {
      type: CommandType.SubCommand,
      name: "upgrade",
      // shortcut: "u",
      description: "Upgrades hex cli to the latest version",

      run: (args: string[]) => upgradeCli(args, executeOptions),
    },
    {
      type: CommandType.SubCommand,
      name: "create",
      shortcut: "c",
      description: "Initialize a new project",

      subcommands: [
        {
          type: CommandType.Option,
          name: "template",
          shortcut: "t",
          description: "The template to use",
          defaultValue: "default",
          valueType: ValueType.String,
        },
      ],

      run: (args: string[]) => create(args, executeOptions),
    },
    {
      type: CommandType.SubCommand,
      name: "run",
      // shortcut: "r",
      description: "Runs the project",

      subcommands: [
        {
          type: CommandType.Option,
          name: "reload",
          shortcut: "r",
          description: "Reloads all modules before running",
          defaultValue: false,
          valueType: ValueType.Boolean,
        },
      ],

      run: (args: string[]) => run(args, executeOptions),
    },
    {
      type: CommandType.SubCommand,
      name: "test",
      // shortcut: "t",
      description: "Runs tests of the project",

      run: (args: string[]) => test(args, executeOptions),
    },
    {
      type: CommandType.Option,
      name: "help",
      shortcut: "h",
      description: "Display help information",
      isDefault: true,

      run: () => showHelp(commands, metadata.version, executeOptions),
    },
    {
      type: CommandType.Option,
      name: "version",
      shortcut: "V",
      description: "Display version information",

      run: () => showVersion(metadata.version),
    },
  ];

  const args = (typeof Deno !== "undefined") ? Deno.args : [];

  execute(commands, args, executeOptions);
};

if (import.meta.main) {
  hexCli();
}

export { hexCli as default, hexCli, run, test, upgradeCli };