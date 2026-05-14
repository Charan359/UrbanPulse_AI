import { useEffect, useRef, useState } from "react";

export function Counter({ to, suffix = "", duration = 1800, decimals = 0 }: { to: number; suffix?: string; duration?: number; decimals?: number }) {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    let raf = 0;
    const step = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span>{val.toFixed(decimals)}{suffix}</span>;
}
