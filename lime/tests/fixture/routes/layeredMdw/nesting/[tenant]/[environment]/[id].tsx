// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { type Handlers, type PageProps } from "../../../../../../../server.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx) {
    const order = ctx.state["middlewareNestingOrder"] as string;
    const resp = await ctx.render(order + "4");
    return resp;
  },
};

export default function Page(props: PageProps) {
  return <div>{props.data}</div>;
}
