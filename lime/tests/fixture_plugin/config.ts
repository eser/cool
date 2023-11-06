// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { type LimeConfig } from "../../server.ts";
import cssInjectPlugin from "./utils/css-inject-plugin.ts";
import jsInjectPlugin from "./utils/js-inject-plugin.ts";
import cssInjectPluginAsync from "./utils/css-inject-plugin-async.ts";
import routePlugin from "./utils/route-plugin.ts";
import secondMiddlewarePlugin from "./utils/second-middleware-plugin.ts";

export const config = {
  plugins: [
    cssInjectPlugin,
    jsInjectPlugin,
    cssInjectPluginAsync,
    routePlugin({ title: "Title Set From Plugin Config" }),
    secondMiddlewarePlugin(),
  ],
} as LimeConfig;
