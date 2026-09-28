import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'bg-card text-foreground border border-border shadow-md rounded-md font-sans text-sm',
          error: 'bg-card text-foreground border-destructive/50',
          success: 'bg-card text-foreground border-success/50',
        },
      }}
    />
  );
}

export { toast } from 'sonner';
