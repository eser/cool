// deno-lint-ignore no-explicit-any
export type EventType = (...args: readonly any[]) => void | Promise<void>;
export type LogType = {
  event: string;
  subscriber: string;
  args: readonly unknown[] | undefined;
};
export type LoggerType = (entry: LogType) => void;

export const emitter = async (
  events: Record<string, EventType[]>,
  eventName: string,
  args?: readonly unknown[],
  loggers?: readonly LoggerType[],
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
