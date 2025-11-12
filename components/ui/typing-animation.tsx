"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { motion, MotionProps, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

// Throttle function to limit the rate of function execution
const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let inThrottle = false;
  let lastArgs: Parameters<F> | null = null;
  let lastThis: any;

  const timeoutFunc = () => {
    if (lastArgs === null) {
      inThrottle = false;
    } else {
      func.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
      setTimeout(timeoutFunc, limit);
    }
  };

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    lastArgs = args;
    lastThis = this;
    
    if (!inThrottle) {
      inThrottle = true;
      func.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
      setTimeout(timeoutFunc, limit);
    }
  };
};

interface TypingAnimationProps extends MotionProps {
  children?: string
  words?: string[]
  className?: string
  duration?: number
  typeSpeed?: number
  deleteSpeed?: number
  delay?: number
  pauseDelay?: number
  loop?: boolean
  as?: React.ElementType
  startOnView?: boolean
  showCursor?: boolean
  blinkCursor?: boolean
  cursorStyle?: "line" | "block" | "underscore"
}

export function TypingAnimation({
  children,
  words,
  className,
  duration = 100,
  typeSpeed,
  deleteSpeed,
  delay = 0,
  pauseDelay = 1000,
  loop = false,
  as: Component = "span",
  startOnView = true,
  showCursor = true,
  blinkCursor = true,
  cursorStyle = "line",
  ...props
}: TypingAnimationProps) {
  const MotionComponent = motion.create(Component)
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  
  // Optimize for mobile by reducing animation speed and increasing delays
  const mobileMultiplier = isMobile ? 1.5 : 1
  const baseTypingSpeed = isMobile ? 150 : 100
  const basePauseDelay = isMobile ? 1500 : 1000

  const [displayedText, setDisplayedText] = useState<string>("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing")
  const elementRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentCharIndexRef = useRef(0)
  
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.1, // Reduced from 0.3 for earlier trigger
    once: true,
  })

  const wordsToAnimate = useMemo(
    () => words || (children ? [children] : []),
    [words, children]
  )
  
  const hasMultipleWords = wordsToAnimate.length > 1
  const typingSpeed = typeSpeed || duration * mobileMultiplier
  const deletingSpeed = deleteSpeed || typingSpeed / 2
  const shouldStart = startOnView ? isInView : true

  // Memoize the cursor character to prevent recalculation
  const cursorChar = useMemo(() => {
    switch (cursorStyle) {
      case "block": return "▌"
      case "underscore": return "_"
      case "line":
      default: return "|"
    }
  }, [cursorStyle])

  // Throttled update function
  const updateText = useCallback(
    throttle((text: string) => {
      setDisplayedText(text);
    }, isMobile ? 32 : 16),
    [isMobile]
  )

  useEffect(() => {
    if (!shouldStart || wordsToAnimate.length === 0) return

    const currentWord = wordsToAnimate[currentWordIndex] || ""
    const graphemes = Array.from(currentWord)
    const isLastWord = currentWordIndex === wordsToAnimate.length - 1
    
    let timeoutDelay = delay > 0 && displayedText === ""
      ? delay
      : phase === "typing"
        ? typingSpeed
        : phase === "deleting"
          ? deletingSpeed
          : pauseDelay

    // Slightly increase delay on mobile for better performance
    if (isMobile) {
      timeoutDelay = Math.min(timeoutDelay * 1.2, 200) // Cap at 200ms for mobile
    }

    timeoutRef.current = setTimeout(() => {
      switch (phase) {
        case "typing":
          if (currentCharIndexRef.current < graphemes.length) {
            const newText = graphemes.slice(0, currentCharIndexRef.current + 1).join("")
            updateText(newText)
            currentCharIndexRef.current++
          } else if (hasMultipleWords || loop) {
            if (!isLastWord || loop) {
              setPhase("pause")
            }
          }
          break

        case "pause":
          setPhase("deleting")
          break

        case "deleting":
          if (currentCharIndexRef.current > 0) {
            const newText = graphemes.slice(0, currentCharIndexRef.current - 1).join("")
            updateText(newText)
            currentCharIndexRef.current--
          } else {
            const nextIndex = (currentWordIndex + 1) % wordsToAnimate.length
            setCurrentWordIndex(nextIndex)
            setPhase("typing")
          }
          break
      }
    }, timeoutDelay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [
    shouldStart,
    phase,
    currentWordIndex,
    displayedText,
    wordsToAnimate,
    hasMultipleWords,
    loop,
    typingSpeed,
    deletingSpeed,
    pauseDelay,
    delay,
    updateText,
    isMobile
  ])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const currentWordGraphemes = Array.from(wordsToAnimate[currentWordIndex] || "")
  const isComplete = !loop &&
    currentWordIndex === wordsToAnimate.length - 1 &&
    currentCharIndexRef.current >= currentWordGraphemes.length &&
    phase !== "deleting"

  const shouldShowCursor = showCursor &&
    !isComplete &&
    (hasMultipleWords || loop || currentCharIndexRef.current < currentWordGraphemes.length)

  return (
    <MotionComponent
      ref={elementRef}
      className={cn("typing-animation tracking-[-0.02em] will-change-contents", className)}
      style={{
        // Optimize for performance
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        ...props.style
      }}
      {...props}
    >
      {displayedText}
      {shouldShowCursor && (
        <span
          className={cn("inline-block will-change-auto", blinkCursor && "animate-blink-cursor")}
          style={{
            animationDuration: '0.7s', // Slower blink on mobile
          }}
        >
          {cursorChar}
        </span>
      )}
    </MotionComponent>
  )
}
