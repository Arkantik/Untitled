import { createFileRoute, Outlet } from '@tanstack/react-router';
import { APP_NAME } from '@pulsarr/shared';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
