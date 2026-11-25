import { useState, useEffect, useRef } from 'react';

/**
 * Smoothly counts up a number from 0 to target value on viewport trigger.
 * Handles strings with suffixes like "100%", "50+", "25+", "99%".
 */
export function useCountUp(targetStr, duration = 1400, trigger = true) {
  const [displayValue, setDisplayValue] = useState(targetStr);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(targetStr);
      hasAnimated.current = true;
      return;
    }

    // Extract numeric part and suffix
    const match = targetStr.match(/(\d+)(.*)/);
    if (!match) {
      setDisplayValue(targetStr);
      return;
    }

    const targetNum = parseInt(match[1], 10);
    const suffix = match[2] || '';

    hasAnimated.current = true;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easedProgress * targetNum);

      setDisplayValue(`${current}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(targetStr);
      }
    };

    requestAnimationFrame(step);
  }, [targetStr, duration, trigger]);

  return displayValue;
}

export default useCountUp;
