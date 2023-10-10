import { type VNode } from "../../../runtime.ts";

import FragmentIsland from "./FragmentIsland.tsx";

function Foo(props: { children: () => VNode }) {
  return props.children();
}

export default function IslandFn() {
  return (
    <div className="island">
      <Foo>
        {() => <FragmentIsland />}
      </Foo>
    </div>
  );
}
