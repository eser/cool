import {
  HexFunctionResult,
  HexFunctionResultAsyncGen,
  HexFunctionResultGen,
} from "../functions/mod.ts";

const defaultDumpFunction = (x: unknown) => console.log(x);

async function dumper(
  iterator: HexFunctionResult,
  dumpFunction: (x: unknown) => void = defaultDumpFunction,
) {
  for await (
    const result of <HexFunctionResultAsyncGen | HexFunctionResultGen> iterator
  ) {
    dumpFunction(result);
  }
}

export { dumper, dumper as default };