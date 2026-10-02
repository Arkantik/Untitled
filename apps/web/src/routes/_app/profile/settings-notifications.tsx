import { HugeiconsIcon } from '@hugeicons/react';
import { Notification01Icon } from '@hugeicons/core-free-icons';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';

export function NotificationsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>In-app notifications</CardTitle>
        <CardDescription>Control which events appear in your notification feed.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <HugeiconsIcon
          icon={Notification01Icon}
          className="size-8 text-muted-foreground/40"
          aria-hidden
        />
        <p className="max-w-xs text-sm text-muted-foreground">
          Notification preferences are coming soon. You'll be able to choose which events appear
          in your feed once the system launches.
        </p>
      </CardContent>
    </Card>
  );
}
