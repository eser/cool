import { AppProps } from "../../../../server.ts";
import { Partial } from "../../../../runtime.ts";
import { Fader } from "../../islands/Fader.tsx";

export default function AppLayout({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>cool lime title</title>
      </head>
      <body f-client-nav={false}>
        <Partial name="body">
          <Fader>
            <Component />
          </Fader>
        </Partial>
        <p>
          <a
            className="page-a-link"
            href="/client_nav_opt_out/page-a"
          >
            Page A
          </a>
        </p>
        <p>
          <a
            className="page-b-link"
            href="/client_nav_opt_out/page-b"
          >
            Page B
          </a>
        </p>
        <p>
          <a
            className="page-c-link"
            href="/client_nav_opt_out/page-c"
          >
            Page C
          </a>
        </p>

        <pre id="logs" />
      </body>
    </html>
  );
}
