"use client";

import { useEffect, useRef, useState } from "react";

function parse(raw: string): { num: number; suffix: string } {
  const match = raw.match(/^([\d,]+)(.*)/);
  if (!match) return { num: 0, suffix: raw };
  return {
    num: parseInt(match[1].replace(/,/g, ""), 10),
    suffix: match[2],
  };
}

export default function CountUp({
  value,
  duration = 1800,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const { num, suffix } = parse(value);
  const [count, setCount] = useState(0);
  /** Until true, show full `value` so SSR/crawlers never snapshot "0". */
  const [animating, setAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || animating) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setAnimating(true);
          setCount(0);

          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * num));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(num);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [num, duration, animating]);

  if (!animating) {
    return (
      <div ref={ref} className={className} suppressHydrationWarning>
        {value}
      </div>
    );
  }

  const formatted = value.includes(",") ? count.toLocaleString() : String(count);

  return (
    <div ref={ref} className={className}>
      {formatted}
      {suffix}
    </div>
  );
}
