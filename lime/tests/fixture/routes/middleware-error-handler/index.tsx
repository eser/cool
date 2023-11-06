// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { type Handlers, type PageProps } from "../../../../server.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render(ctx.state["flag"]);
  },
};

export default function Home(props: PageProps<boolean>) {
  if (props.data) {
    throw Error("i'm erroring on purpose");
  }
  return <div>this won't get shown</div>;
}
