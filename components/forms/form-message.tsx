export type Message = {
    type?: 'success' | 'error' | 'message';
    message?: string;
  };
  
  export function FormMessage({ type, children }: { type?: Message['type'], children?: React.ReactNode }) {
    if (!children) return null;
  
    const classes = {
      success: 'text-green-500 border-l-2 border-green-500',
      error: 'text-red-500 border-l-2 border-red-500',
      message: 'text-foreground border-l-2',
    };
  
    return (
      <div className={`flex flex-col gap-2 w-full max-w-md text-sm px-4 ${classes[type || 'message']}`}>
        {children}
      </div>
    );
  }