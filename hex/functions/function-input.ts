// deno-lint-ignore no-explicit-any
export interface HexFunctionInput<T = Record<string | number | symbol, any>> {
  platform?: {
    type: string;
    name: string;
  };
  event?: Record<string, unknown> & { name: string };
  requestedFormat?: {
    mimetype: string;
    format: string;
  };
  params: T;
}

export { type HexFunctionInput as default };