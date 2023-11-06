// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { useSignal } from "@preact/signals-react";
import Counter from "../islands/Counter.tsx";

export default function SignalShared() {
  const sig = useSignal(1);
  return (
    <div>
      <Counter id="counter-1" count={sig} />
      <Counter id="counter-2" count={sig} />
    </div>
  );
}
