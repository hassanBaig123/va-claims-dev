'use client';
import React, { useState, useRef, useEffect } from 'react';

interface FadeInOnViewProps {
  children?: React.ReactNode;
  delay?: string; // Specify delay as a string like '1s' or '500ms'
  threshold?: number | number[]; // Accept threshold as a prop
}

const FadeInOnView: React.FC<FadeInOnViewProps> = ({ children, delay = '0s', threshold = 0.5 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    }, { threshold }); // Use threshold in the observer options

    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => observer.disconnect();
  }, [threshold]); // Add threshold to the dependency array

  const style = {
    transitionDelay: delay,
  };

  return (
    <div
      className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
      ref={domRef}
      style={isVisible ? style : undefined}
    >
      {children}
    </div>
  );
};

export default FadeInOnView;
