import { cn } from "@/utils";
import ReactMarkdown from 'react-markdown';

export function TypographyP({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={cn("leading-7", className)} style={{ pageBreakInside: 'avoid' }}>
      <ReactMarkdown>{typeof children === 'string' ? children : ''}</ReactMarkdown>
    </p>
  );
}
