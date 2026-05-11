"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  autoPlay?: boolean;
  active?: boolean;
}

export default function VideoPlayer({
  src,
  className = "",
  muted = true,
  loop = true,
  poster,
  autoPlay = false,
  active,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => undefined);
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      if (active === false) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else if (active === true && autoPlay) {
        videoRef.current.play().catch(() => undefined);
        setIsPlaying(true);
      }
    }
  }, [active, autoPlay]);

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        loop={loop}
        poster={poster}
        playsInline
        className="h-full w-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <button
        onClick={togglePlay}
        className={`absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-accent-500 ${
          showControls || !isPlaying ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" fill="currentColor" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
        )}
      </button>

      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/10 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/90 text-white shadow-xl transition-transform hover:scale-110">
            <Play className="h-8 w-8 ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
}
