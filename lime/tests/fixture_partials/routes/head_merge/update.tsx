// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { defineRoute, type RouteConfig } from "../../../../server.ts";
import { Head, Partial } from "../../../../runtime.ts";
import { Fader } from "../../islands/Fader.tsx";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default defineRoute((req, ctx) => {
  return (
    <>
      <Head>
        <title>Head merge updated</title>
        <meta name="foo" content="bar baz" />
        <meta property="og:foo" content="og value foo" />
        <meta property="og:bar" content="og value bar" />
        <link rel="stylesheet" href="/other.css" />
        <style>{`p { color: green }`}</style>
      </Head>
      <Partial name="slot-1">
        <Fader>
          <h1>updated</h1>
          <p className="status-updated">updated content</p>
        </Fader>
      </Partial>
    </>
  );
});
