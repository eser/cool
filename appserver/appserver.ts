// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import * as runModes from "../standards/run-modes.ts";
import { events } from "../events/events.ts";
import { di } from "../di/services.ts";

import { type Channel } from "./channel.ts";
import { type Module } from "./module.ts";

export class AppServer {
  static default = Symbol("default");

  runMode: runModes.RunMode;
  events: typeof events;
  di: typeof di;
  channels: Map<string, Channel>;
  modules: Map<string, Module>;

  constructor() {
    this.runMode = runModes.RunMode.Development;
    this.events = events;
    this.di = di;
    this.channels = new Map<string, Channel>();
    this.modules = new Map<string, Module>();
  }

  addModule(module: Module) {
    const name = module.name ?? module.constructor.name;

    this.modules.set(name, module);
  }

  addChannel(channel: Channel) {
    const name = channel.name ?? channel.constructor.name;

    this.channels.set(name, channel);
  }

  setAsDefaultAppServer() {
    this.di.register(AppServer.default, this);
  }

  // execute(_options: unknown) {
  // }
}
