'use client';

import React, { ReactNode } from 'react';
import useScrollAnimation from '@/lib/useScrollAnimation';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'rotate' | 'fade';
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'up',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  className = '',
  style = {},
}) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
    delay,
  });

  const getAnimationClass = () => {
    const baseClass = `scroll-reveal-${animation}`;
    return isVisible ? `${baseClass} revealed` : baseClass;
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${getAnimationClass()} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
