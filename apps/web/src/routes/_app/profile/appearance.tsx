import { createFileRoute } from '@tanstack/react-router';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/profile/appearance')({
  component: AppearanceSettingsPage,
});

function AppearanceSettingsPage() {
  return <EmptyState title="Appearance" description="Choose your preferred color scheme." />;
}
