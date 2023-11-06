// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { ErrorHandler, ErrorPageProps } from "../../../server.ts";

export const handler: ErrorHandler = (_req, ctx) => {
  return ctx.render();
};

export default function Error500Page({ error }: ErrorPageProps) {
  return <p className="custom-500">Custom 500: {(error as Error).message}</p>;
}
