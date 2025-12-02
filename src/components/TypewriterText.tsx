import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  showCaret?: boolean;
  onComplete?: () => void;
}

export const TypewriterText = ({
  text,
  className,
  speed = 50,
  delay = 0,
  showCaret = true,
  onComplete,
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [displayedText, text, speed, hasStarted, onComplete]);

  return (
    <span className={cn("font-typewriter", className)}>
      {displayedText}
      {showCaret && !isComplete && (
        <span className="typewriter-caret ml-0.5">&nbsp;</span>
      )}
    </span>
  );
};

// Pre-built loading message component
export const TypewriterLoading = ({ message = "Retrieving case file" }: { message?: string }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-muted-foreground font-typewriter">
      <span>{message}</span>
      <span className="w-6">{dots}</span>
    </div>
  );
};