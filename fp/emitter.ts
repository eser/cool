// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import { type Promisable } from "../standards/promises.ts";
import { type ArgList } from "../standards/functions.ts";

export type EventType = (...args: ArgList) => Promisable<void>;

export type LogType = {
  event: string;
  subscriber: string;
  args: ReadonlyArray<unknown> | undefined;
};

export type LoggerType = (entry: LogType) => void;

export const emitter = async (
  events: Record<string, Array<EventType>>,
  eventName: string,
  args?: ReadonlyArray<unknown>,
  loggers?: ReadonlyArray<LoggerType>,
): Promise<void> => {
  const isEventWildcard = eventName === "*";
  const argsPass = (args !== undefined) ? args : [];

  for (const [eventKey, value] of Object.entries(events)) {
    if (!isEventWildcard && eventName !== eventKey) {
      continue;
    }

    for (const eventSubscriber of value) {
      loggers?.forEach((logger: LoggerType) => {
        logger(
          { event: eventKey, subscriber: eventSubscriber.name, args: args },
        );
      });

      await eventSubscriber(...argsPass);
    }
  }
};

export { emitter as default };
