import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail01Icon } from '@hugeicons/core-free-icons';
import { Button } from '~/components/ui/button';
import { Alert } from '~/components/ui/alert';

export const Route = createFileRoute('/_auth/verify-email')({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { t } = useTranslation('auth');
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setLoading(true);
    // TODO: wire up Better Auth sendVerificationEmail()
    setLoading(false);
    setResent(true);
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <HugeiconsIcon icon={Mail01Icon} className="size-7 text-primary" aria-hidden />
      </div>

      <div>
        <h1 className="text-xl font-semibold">{t('verifyEmail.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('verifyEmail.subtitleGeneric')}</p>
      </div>

      {resent && <Alert tone="success">{t('verifyEmail.resent')}</Alert>}

      <Button variant="outline" className="w-full" loading={loading} onClick={handleResend}>
        {t('verifyEmail.resend')}
      </Button>

      <p className="text-sm">
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
          {t('verifyEmail.backToSignIn')}
        </Link>
      </p>
    </div>
  );
}
