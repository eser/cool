// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { type MiddlewareHandlerContext } from "../../../../server.ts";
import { type PluginMiddlewareState } from "../../utils/route-plugin.ts";

export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext<PluginMiddlewareState>,
) {
  ctx.state.test = "look, i'm set from a plugin!";
  const resp = await ctx.next();
  return resp;
}
