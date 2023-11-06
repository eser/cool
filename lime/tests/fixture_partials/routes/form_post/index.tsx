// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { Partial } from "../../../../runtime.ts";
import { defineRoute, Handlers } from "../../../../server.ts";
import { Logger } from "../../islands/Logger.tsx";

export const handler: Handlers = {
  POST(req, ctx) {
    return ctx.render();
  },
};

export default defineRoute(async (req, ctx) => {
  let value = "";

  if (req.body !== null) {
    const data = await req.formData();
    value += data.has("name") ? data.get("name") + "_foo" : "";
  }

  return (
    <div>
      <form action="/form_post" method="post">
        <Partial name="slot-1">
          <p className="status">Default content</p>
          <p>
            <input type="text" value={value} name="name" />
          </p>
          <Logger name="Form" />
          <p className="url">{ctx.url.toString()}</p>
        </Partial>
        <button type="submit" className="submit">
          submit
        </button>
      </form>
      <pre id="logs" />
    </div>
  );
});
