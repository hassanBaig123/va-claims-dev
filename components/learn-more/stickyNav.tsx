'use client'
import React, { useEffect, useState } from 'react';

interface StickyNavProps {
  children: React.ReactNode;
}

const StickyNav: React.FC<StickyNavProps> = ({ children }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const navElement = document.getElementById('sticky-nav'); // Ensure this ID is unique
      const stickyClass = '';

      if (navElement) {
        if (scrollTop >= navElement.offsetTop) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    //<nav id="sticky-nav" className={`my-8 w-full py-10 border-b-2 sticky top-0 bg-white z-50 ${isSticky ? 'sticky-nav' : ''}`}>
    <nav id="sticky-nav" className={`my-8 w-full border-b-2 sticky top-0 bg-white z-50 ${isSticky ? 'sticky-nav' : ''}`}>
      {children}
    </nav>
  );
};

export default StickyNav;