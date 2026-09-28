import { Link, useRouter } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, DashboardSquare02Icon } from '@hugeicons/core-free-icons';
import { useTranslation } from 'react-i18next';
import { ErrorLayout } from '~/components/errors/error-layout';
import { Button } from '~/components/ui/button';

export function NotFound() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ErrorLayout
      code="404"
      eyebrow={t('errors.404Eyebrow')}
      title={t('errors.404Title')}
      description={t('errors.404Description')}
      actions={
        <>
          <Button asChild size="lg">
            <Link to="/dashboard">
              <HugeiconsIcon icon={DashboardSquare02Icon} className="size-4" aria-hidden />
              {t('errors.backToDashboard')}
            </Link>
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.history.back()}>
            <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" aria-hidden />
            {t('errors.goBack')}
          </Button>
        </>
      }
    />
  );
}
