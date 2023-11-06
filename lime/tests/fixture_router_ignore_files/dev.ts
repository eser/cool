#!/usr/bin/env -S deno run -A --watch=static/,routes/
// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { dev } from "../../dev.ts";
import { config } from "./config.ts";

await dev(import.meta.url, config);
