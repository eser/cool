import { Partial } from "$cool/lime/runtime.ts";

export default function SlotDemo() {
  return (
    <div>
      <form f-partial="/form/update">
        <Partial name="slot-1">
          <p className="status">Default content</p>
          <p>
            <input type="text" value="foo" />
          </p>
        </Partial>
        <button type="submit" className="submit">
          submit
        </button>
      </form>
    </div>
  );
}
