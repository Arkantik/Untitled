import type { SessionUser } from '~/server/session';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

interface Props {
  user: SessionUser;
  hasAccounts: boolean;
}

export function DashboardGreeting({ user, hasAccounts }: Props) {
  const firstName = user.name.split(' ')[0];
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        {getGreeting()},{' '}
        <span className="text-primary">{firstName}</span>
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasAccounts
          ? "Here's what's happening with your social presence."
          : 'Connect a social account to start scheduling posts.'}
      </p>
    </div>
  );
}
