import { cn } from '@/utils';
import React, { ReactNode } from 'react';

interface TypographyH2Props {
  children: ReactNode;
  className?: string; // Add this line to include the className property
}

export function TypographyH2({ children, className }: TypographyH2Props) {
  return (
    <h2 className={cn("scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)} style={{ pageBreakAfter: 'avoid' }}>
      {children}
    </h2>
  );
}