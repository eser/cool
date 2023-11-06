// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { type RouteConfig } from "../../../../server.ts";
import CounterA from "../../islands/CounterA.tsx";
import { Fader } from "../../islands/Fader.tsx";

export const config: RouteConfig = {
  skipAppWrapper: true,
};

export default function PageA() {
  return (
    <Fader>
      <h1>Page A</h1>
      <p>asdfasdf asdf asdf</p>
      <CounterA />
    </Fader>
  );
}
