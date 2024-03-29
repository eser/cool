#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write --allow-net
// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import { metadata } from "https://deno.land/x/cool@0.7.13/mod.ts";
import { deno } from "https://deno.land/x/cool@0.7.13/deps.ts";
import {
  type Command,
  CommandType,
  execute,
  ExecuteOptions,
  showHelp,
  showVersion,
  ValueType,
} from "https://deno.land/x/cool@0.7.5/hex/cli/mod.ts";
import { create } from "https://deno.land/x/cool@0.7.5/hex/generator/create.ts";

export const repl = async (_args: Array<string>, _options: ExecuteOptions) => {
  const p = new deno.Command(
    deno.execPath(),
    {
      args: [
        "repl",
        "--unstable-cron",
        "--unstable-kv",
        "--unstable-temporal",
        "--allow-all",
        "--eval-file=https://deno.land/x/cool@0.7.13/repl-init.ts",
      ],
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
    },
  );

  await (p.spawn()).status;
};

export const upgradeCli = async (
  _args: Array<string>,
  _options: ExecuteOptions,
) => {
  const p = new deno.Command(
    deno.execPath(),
    {
      args: [
        "install",
        "--allow-all",
        "--reload",
        "--force",
        "--name",
        "cool",
        "https://deno.land/x/cool/cool.ts",
      ],
      stdout: "inherit",
      stderr: "inherit",
      stdin: "null",
    },
  );

  await (p.spawn()).status;
};

export const run = async (_args: Array<string>, _options: ExecuteOptions) => {
  const p = new deno.Command(
    deno.execPath(),
    {
      args: ["task", "start"],
      stdout: "inherit",
      stderr: "inherit",
      stdin: "null",
    },
  );

  await (p.spawn()).status;
};

const runDev = async (_args: Array<string>, _options: ExecuteOptions) => {
  const p = new deno.Command(
    deno.execPath(),
    {
      args: ["task", "dev"],
      stdout: "inherit",
      stderr: "inherit",
      stdin: "null",
    },
  );

  await (p.spawn()).status;
};

export const test = async (_args: Array<string>, _options: ExecuteOptions) => {
  const p = new deno.Command(
    deno.execPath(),
    {
      args: ["task", "test"],
      stdout: "inherit",
      stderr: "inherit",
      stdin: "null",
    },
  );

  await (p.spawn()).status;
};

export const main = () => {
  const executeOptions: ExecuteOptions = {
    command: "cool",
    module: import.meta.url,
  };

  const commands: Array<Command> = [
    {
      type: CommandType.SubCommand,
      name: "upgrade",
      // shortcut: "u",
      description: "Upgrades cool cli to the latest version",
      // isDefault: true,

      run: (args: Array<string>) => upgradeCli(args, executeOptions),
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

      run: (args: Array<string>) => create(args, executeOptions),
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

      run: (args: Array<string>) => run(args, executeOptions),
    },
    {
      type: CommandType.SubCommand,
      name: "dev",
      // shortcut: "d",
      description: "Runs the project in development mode",

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

      run: (args: Array<string>) => runDev(args, executeOptions),
    },
    {
      type: CommandType.SubCommand,
      name: "test",
      // shortcut: "t",
      description: "Runs tests of the project",

      run: (args: Array<string>) => test(args, executeOptions),
    },
    {
      type: CommandType.SubCommand,
      name: "repl",
      // shortcut: "t",
      description: "Runs REPL",

      run: (args: Array<string>) => repl(args, executeOptions),
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

      run: () => showVersion(metadata.version, executeOptions),
    },
  ];

  execute(commands, deno.args, executeOptions);
};

if (import.meta.main) {
  main();
}

export { main as default, metadata };
