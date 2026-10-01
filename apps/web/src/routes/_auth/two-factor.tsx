import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '~/lib/zod-resolver';
import { z } from 'zod';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { toast } from '~/components/ui/toast';

export const Route = createFileRoute('/_auth/two-factor')({
  component: TwoFactorPage,
});

const codeSchema = z.object({ code: z.string().min(6).max(6) });
const recoverySchema = z.object({ code: z.string().min(1) });

type CodeData = z.infer<typeof codeSchema>;
type RecoveryData = z.infer<typeof recoverySchema>;

function TwoFactorPage() {
  const [useRecovery, setUseRecovery] = useState(false);

  return useRecovery ? (
    <RecoveryForm onSwitch={() => setUseRecovery(false)} />
  ) : (
    <AuthCodeForm onSwitch={() => setUseRecovery(true)} />
  );
}

function AuthCodeForm({ onSwitch }: { onSwitch: () => void }) {
  const { t } = useTranslation('auth');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CodeData>({ resolver: zodResolver(codeSchema) });

  async function onSubmit(_data: CodeData) {
    // TODO: wire up Better Auth twoFactor.verifyTotp()
    toast.error('Auth not yet connected.');
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">{t('twoFactor.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('twoFactor.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label={t('twoFactor.code')} error={errors.code?.message}>
          {({ id, 'aria-describedby': describedBy, invalid }) => (
            <Input
              id={id}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              aria-describedby={describedBy}
              invalid={invalid}
              {...register('code')}
            />
          )}
        </Field>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {t('twoFactor.submit')}
        </Button>
      </form>

      <p className="text-center text-sm">
        <button
          type="button"
          onClick={onSwitch}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {t('twoFactor.useRecoveryCode')}
        </button>
      </p>
    </div>
  );
}

function RecoveryForm({ onSwitch }: { onSwitch: () => void }) {
  const { t } = useTranslation('auth');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoveryData>({ resolver: zodResolver(recoverySchema) });

  async function onSubmit(_data: RecoveryData) {
    // TODO: wire up Better Auth twoFactor.verifyBackupCode()
    toast.error('Auth not yet connected.');
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">{t('twoFactor.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('twoFactor.recoverySubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label={t('twoFactor.recoveryCode')} error={errors.code?.message}>
          {({ id, 'aria-describedby': describedBy, invalid }) => (
            <Input
              id={id}
              type="text"
              autoComplete="off"
              aria-describedby={describedBy}
              invalid={invalid}
              {...register('code')}
            />
          )}
        </Field>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {t('twoFactor.submit')}
        </Button>
      </form>

      <p className="text-center text-sm">
        <button
          type="button"
          onClick={onSwitch}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {t('twoFactor.useAuthCode')}
        </button>
      </p>
    </div>
  );
}
