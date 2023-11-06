// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { type PageProps, type RouteConfig } from "../../../server.ts";

export default function WildcardPage({ params }: PageProps) {
  if (typeof params["path"] === "string") {
    return <p>{params["path"]}</p>;
  } else {
    return <p>Not a string.</p>;
  }
}

export const config: RouteConfig = {
  routeOverride: "/foo/:path*",
};
