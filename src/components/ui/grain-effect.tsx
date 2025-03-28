
import React from "react";
import { cn } from "@/lib/utils";

interface GrainEffectProps {
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

const GrainEffect = ({ 
  className,
  intensity = "medium" 
}: GrainEffectProps) => {
  // Different opacity values based on intensity
  const opacityValue = {
    light: "0.03",
    medium: "0.05",
    heavy: "0.08"
  };

  return (
    <div 
      className={cn(
        "pointer-events-none fixed inset-0 z-40 h-full w-full overflow-hidden",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: opacityValue[intensity],
        mixBlendMode: "multiply"
      }}
      aria-hidden="true"
    />
  );
};

export default GrainEffect;
