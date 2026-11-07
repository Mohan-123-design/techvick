import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({
  end = 0,
  start = 0,
  duration = 1600,
  prefix = '',
  suffix = '',
  separator = false,
  className = '',
}) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasAnimated(true);

          let startTime = null;
          const target = Number(end);
          const initial = Number(start);

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Cubic ease-out curve
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(initial + (target - initial) * easeOut);

            setCount(current);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(target);
            }
          };

          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, start, duration, hasAnimated]);

  const formattedCount = separator
    ? count.toLocaleString('en-IN')
    : count;

  return (
    <span ref={elementRef} className={`animated-counter ${className}`}>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
}

