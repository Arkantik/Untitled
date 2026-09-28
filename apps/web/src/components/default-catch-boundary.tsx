import { type ErrorComponentProps, Link, useRouter } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, DashboardSquare02Icon, ReloadIcon } from '@hugeicons/core-free-icons';
import { useTranslation } from 'react-i18next';
import { ErrorLayout } from '~/components/errors/error-layout';
import { Button } from '~/components/ui/button';

export function DefaultCatchBoundary({ error, reset }: ErrorComponentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const detail = error instanceof Error ? error.message : String(error);

  return (
    <ErrorLayout
      tone="destructive"
      code="500"
      eyebrow={t('errors.500Eyebrow')}
      title={t('errors.500Title')}
      description={t('errors.500Description')}
      actions={
        <>
          <Button
            type="button"
            size="lg"
            onClick={() => {
              reset();
              void router.invalidate();
            }}
          >
            <HugeiconsIcon icon={ReloadIcon} className="size-4" aria-hidden />
            {t('actions.retry')}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard">
              <HugeiconsIcon icon={DashboardSquare02Icon} className="size-4" aria-hidden />
              {t('errors.backToDashboard')}
            </Link>
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.history.back()}>
            <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" aria-hidden />
            {t('errors.goBack')}
          </Button>
        </>
      }
    >
      {detail ? (
        <details className="mx-auto max-w-md rounded-md border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground">
          <summary className="cursor-pointer font-medium text-foreground select-none">
            {t('errors.technicalDetails')}
          </summary>
          <p className="mt-2 font-mono text-xs whitespace-pre-wrap wrap-break-word">{detail}</p>
        </details>
      ) : null}
    </ErrorLayout>
  );
}
