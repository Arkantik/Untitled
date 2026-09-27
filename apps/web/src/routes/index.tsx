import { createFileRoute } from '@tanstack/react-router';
import { APP_NAME, APP_DESCRIPTION } from '@pulsarr/shared';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-5xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          {APP_DESCRIPTION}
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/api/docs"
            className="inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
          >
            API Docs
          </a>
          <a
            href="https://github.com/pulsarr"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--accent)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
