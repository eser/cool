// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { Partial } from "../../../../runtime.ts";
import { defineRoute, Handlers } from "../../../../server.ts";
import { Logger } from "../../islands/Logger.tsx";

export const handler: Handlers = {
  POST(_req, ctx) {
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
      <form id="foo">
        <Partial name="slot-1">
          <p className="status">Default content</p>
          <p>
            <input type="text" value={value} name="name" />
          </p>
          <Logger name="Form" />
          <p className="url">{ctx.url.toString()}</p>
        </Partial>
      </form>
      <button
        type="submit"
        className="submit"
        form="foo"
        formaction="/form_submitter_partial_invalid"
        f-partial="/form_submitter_partial"
        formmethod="POST"
      >
        submit
      </button>
      <pre id="logs" />
    </div>
  );
});
