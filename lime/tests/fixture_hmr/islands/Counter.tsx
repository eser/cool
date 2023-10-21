import { useSignal } from "@preact/signals";

export default function Counter() {
  const sig = useSignal(0);

  return (
    <div className="counter">
      <p>{sig}</p>
      <button onClick={() => sig.value++}>update</button>
    </div>
  );
}
