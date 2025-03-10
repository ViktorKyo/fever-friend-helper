
import { cn } from "./utils";

export const animateOnMount = (delay?: number): string => {
  return cn(
    "animate-fade-in",
    delay && `animation-delay-${delay}`
  );
};

export const slideUpAnimation = (delay?: number): string => {
  return cn(
    "animate-slide-up opacity-0",
    delay && `animation-delay-${delay}`
  );
};

export const slideDownAnimation = (delay?: number): string => {
  return cn(
    "animate-slide-down opacity-0",
    delay && `animation-delay-${delay}`
  );
};

export const pulseAnimation = (): string => {
  return "animate-pulse-gentle";
};

export const floatAnimation = (): string => {
  return "animate-float";
};

export const pageTransition = (): string => {
  return "transition-all duration-300 ease-in-out";
};
