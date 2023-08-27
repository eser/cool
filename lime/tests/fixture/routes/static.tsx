import { asset } from "$cool/lime/runtime.ts";

export default function StaticPage() {
  return (
    <div>
      <p>This is a static page.</p>
      <img src={asset("/image.png")} />
    </div>
  );
}
