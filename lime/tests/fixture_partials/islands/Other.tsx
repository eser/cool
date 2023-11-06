// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { useSignal } from "@preact/signals-react";
import { Logger } from "./Logger.tsx";

export default function Other() {
  const sig = useSignal(0);
  return (
    <Logger name="Other">
      <div className="island island-other">
        <p className="output-other">{sig.value}</p>
        <button onClick={() => sig.value += 1}>
          update
        </button>
      </div>
    </Logger>
  );
}
