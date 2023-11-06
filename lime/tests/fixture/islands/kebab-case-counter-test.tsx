// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { type Signal } from "@preact/signals-core";
import { IS_BROWSER } from "../../../runtime.ts";

interface KebabCaseFileNameTestProps {
  count: Signal<number>;
  id: string;
}

export default function KebabCaseFileNameTest(
  props: KebabCaseFileNameTestProps,
) {
  return (
    <div id={props.id}>
      <p>{props.count}</p>
      <button
        id={`b-${props.id}`}
        onClick={() => props.count.value += 1}
        disabled={!IS_BROWSER}
      >
        +1
      </button>
    </div>
  );
}
