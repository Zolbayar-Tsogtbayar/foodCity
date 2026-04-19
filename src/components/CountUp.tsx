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
  duration = 900,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const { num, suffix } = parse(value);
  /** Full string — good for SSR / crawlers (never "0" only). */
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let finished = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || finished) return;
        finished = true;
        observer.disconnect();

        const start = performance.now();
        let lastInt = -1;

        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.min(Math.floor(eased * num), num);

          // Only re-render when the integer changes — avoids ~60 React updates/sec.
          if (current !== lastInt || progress >= 1) {
            lastInt = current;
            const formatted = value.includes(",")
              ? current.toLocaleString()
              : String(current);
            setDisplay(formatted + suffix);
          }

          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.25, rootMargin: "0px 0px 8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [num, duration, value, suffix]);

  return (
    <div ref={ref} className={className} suppressHydrationWarning>
      {display}
    </div>
  );
}
