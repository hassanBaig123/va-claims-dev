import React, { ReactNode } from 'react';

interface TypographyH1Props {
  children: ReactNode;
  className?: string; // Add this line to include the className property
}

export function TypographyH1({ className = '', children }: TypographyH1Props) {
  return (
    <h2 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}>
      {children}
    </h2>
  );
}