import { useCallback, useRef } from 'react';

const SCROLL_DURATION = 800;
const RETRY_DELAY = 100;
const MAX_RETRIES = 10;

export const useSmoothScroll = () => {
  const retryCountRef = useRef({});

  const scrollToSection = useCallback((targetId) => {
    if (!targetId) return;

    const performScroll = (attempt = 0) => {
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        if (attempt < MAX_RETRIES) {
          retryCountRef.current[targetId] = attempt + 1;
          setTimeout(() => performScroll(attempt + 1), RETRY_DELAY);
        }
        return;
      }

      retryCountRef.current[targetId] = 0;

      const currentPosition = window.pageYOffset;
      const targetPosition = targetElement.getBoundingClientRect().top + currentPosition;
      const startTime = performance.now();
      const distance = targetPosition - currentPosition;

      if (Math.abs(distance) < 10) {
        targetElement.focus?.({ preventScroll: true });
        return;
      }

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / SCROLL_DURATION, 1);
        const easeProgress = easeOutQuart(progress);

        window.scrollTo(0, currentPosition + distance * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    };

    performScroll(0);
  }, []);

  return { scrollToSection };
};

export default useSmoothScroll;