import { type ServiceKey } from "./container.ts";
import { registry } from "./services.ts";

// declare global {
//   interface SymbolConstructor {
//     metadata?: symbol;
//   }
// }

// Symbol.metadata ??= Symbol("metadata");

export const injectable = (key?: ServiceKey) => {
  // deno-lint-ignore no-explicit-any
  return (source: any, context?: ClassDecoratorContext) => {
    if (context !== undefined && context.kind !== "class") {
      return;
    }

    const name = key ?? context?.name ?? source.name;

    if (name !== undefined) {
      registry.setLazy(name, () => new source());
    }
  };
};
