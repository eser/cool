// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { Partial } from "../../../../runtime.ts";
import { defineRoute, type Handlers } from "../../../../server.ts";
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
      <form
        id="foo"
        action="/form_submitter_partial_no_client_nav"
        method="post"
      >
        <Partial name="slot-1">
          <p className="status">Default content</p>
          <p>
            <input type="text" value={value} name="name" />
          </p>
          <Logger name="Form" />
          <p className="url">{ctx.url.toString()}</p>
        </Partial>
      </form>
      <div f-client-nav={false}>
        <button
          type="submit"
          className="submit"
          form="foo"
        >
          submit
        </button>
      </div>
      <pre id="logs" />
    </div>
  );
});
