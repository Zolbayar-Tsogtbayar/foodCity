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
  muted = false,
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
      
      <div 
        className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-300 ${!isPlaying || showControls ? 'bg-black/20 opacity-100' : 'opacity-0'}`}
        onClick={togglePlay}
      >
        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/90 text-white shadow-xl transition-transform hover:scale-110 ${(!isPlaying || showControls) ? 'scale-100' : 'scale-90'}`}>
          {isPlaying ? (
            <Pause className="h-8 w-8" fill="currentColor" />
          ) : (
            <Play className="h-8 w-8 ml-1" fill="currentColor" />
          )}
        </div>
      </div>
    </div>
  );
}
