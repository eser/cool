// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { Head } from "../../../runtime.ts";

export default function Page() {
  return (
    <>
      <h1>Card head css deduplication</h1>
      <Head>
        <title>foo</title>
        <link rel="stylesheet" href="/card.css" key="card.css" />
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <Head>
        <title>bar</title>
        <link rel="stylesheet" href="/card.css" key="card.css" />
        <meta property="og:title" content="Other title" key="title" />
      </Head>
    </>
  );
}
