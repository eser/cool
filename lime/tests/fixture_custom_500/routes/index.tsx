import { type Handlers } from "../../../server.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    throw new Error("Pickle Rick!");
  },
};
