"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function TopLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show progress bar on pathname change
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] h-1 pointer-events-none">
      <div className="h-full bg-accent-500 shadow-[0_0_10px_#eab308] animate-progress-bar" />
      <style jsx>{`
        .animate-progress-bar {
          animation: progress 0.6s ease-out forwards;
        }
        @keyframes progress {
          0% { width: 0%; opacity: 1; }
          50% { width: 70%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
