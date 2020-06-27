import HexFunction from "./types/function.ts";
import HexFunctionInput from "./types/functionInput.ts";
import HexFunctionContext from "./types/functionContext.ts";
import HexFunctionNext from "./types/functionNext.ts";
import HexFunctionResult from "./types/functionResult.ts";

function composer(...functions: Array<HexFunction>): HexFunction {
  return function (
    input: HexFunctionInput,
    context: HexFunctionContext,
    next?: HexFunctionNext,
  ): HexFunctionResult {
    let index = 0;

    const jump: HexFunctionNext = async (): HexFunctionResult => {
      const current = functions[index];

      index += 1;

      return current(
        input,
        context,
        jump,
      );
    };

    return jump();
  };
}

export {
  composer as default,
};