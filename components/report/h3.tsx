import React, { ReactNode } from 'react';

interface TypographyH3Props {
  children: ReactNode;
  className?: string; // Add this line to include the className property
}

export function TypographyH3({ className = '', children }: TypographyH3Props) {
  return (
    <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>
      {children}
    </h3>
  );
}