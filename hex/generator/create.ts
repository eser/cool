import { type ExecuteOptions, validateOptions } from "../cli/mod.ts";
import metadata from "../../metadata.json" assert { type: "json" };
import { flags } from "./deps.ts";
import { generate } from "./generate.ts";

const showHelp = (options: ExecuteOptions) => {
  let generateCommand, otherCommand;

  if (options.command !== undefined) {
    generateCommand = `cool create`;
    otherCommand = `cool create`;
  } else {
    generateCommand = `deno run -A ${options.moduleRelative}`; // --allow-read --allow-write --allow-net
    otherCommand = `deno run -A ${options.moduleRelative}`; // --allow-read
  }

  const messageContents = `cool/hex/generator

  Initialize a new cool project. This will create all the necessary files for
  a new cool project.

  To generate a project in the './my-cool-project' subdirectory:
    ${generateCommand} my-cool-project

  To generate a project in the './my-cool-project' subdirectory with the
  specific template:
    ${generateCommand} my-cool-project --template service

  To generate a project in the current directory:
    ${generateCommand} .

  Print this message:
    ${otherCommand} --help
  `;

  console.log(messageContents);
};

const showVersion = () => {
  const messageContents = `cool/hex/generator version ${metadata.version}`;

  console.log(messageContents);
};

export const create = async (args: string[], options: ExecuteOptions) => {
  const options_ = validateOptions(options);

  const params = flags.parse(args, {
    alias: {
      "h": "help",
      "V": "version",
      "t": "template",
    },
    boolean: ["help", "version"],
    string: ["template"],
    default: {},
  });

  if (params.version) {
    showVersion();
    return;
  }

  if (params.help || params._.length === 0) {
    showHelp(options_);
    return;
  }

  if (params._.length === 1) {
    const [projectPath] = params._ as string[];

    const relativeUrl = new URL(".", import.meta.url);

    await generate(relativeUrl.href, projectPath, params.template);

    return;
  }

  console.log(
    `invalid command - ${args.join(" ")}'`,
  );
};

if (import.meta.main) {
  create(Deno.args, { module: import.meta.url });
}

export { create as default };