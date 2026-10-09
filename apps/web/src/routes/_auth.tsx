import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { fetchSession } from '~/server/session';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon, BarChartIcon, MessageMultiple01Icon } from '@hugeicons/core-free-icons';
import { APP_NAME, APP_DESCRIPTION } from '@veypost/shared';

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const authenticated = await fetchSession();
    if (authenticated) throw redirect({ to: '/dashboard' });
  },
  component: AuthLayout,
});

const features = [
  { icon: MessageMultiple01Icon, label: 'Publish to X, Bluesky, LinkedIn, and more' },
  { icon: Calendar01Icon, label: 'Schedule posts and manage your queue' },
  { icon: BarChartIcon, label: 'Track performance with built-in analytics' },
];

function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div
        className="hidden regular:flex regular:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #201D8C 0%, #100F48 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 25% 15%, rgba(83,80,224,0.45) 0%, transparent 55%)',
          }}
        />

        <span className="relative text-2xl font-bold text-white tracking-tight">{APP_NAME}</span>

        <div className="relative space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Your social media,
              <br />
              on your terms.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#B2AEF4' }}>
              {APP_DESCRIPTION}
            </p>
          </div>

          <ul className="space-y-4">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="shrink-0 w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
                  <HugeiconsIcon icon={Icon} className="size-4" style={{ color: '#B2AEF4' }} aria-hidden />
                </div>
                <span className="text-sm text-white/75">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/25">Open source Â· Apache 2.0</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        <div className="regular:hidden mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="rounded-xl border border-border bg-card p-8 shadow-[0_4px_12px_rgba(0,0,0,.08),0_2px_6px_rgba(0,0,0,.05)]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
