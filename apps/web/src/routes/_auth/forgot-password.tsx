import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '~/lib/zod-resolver';
import { z } from 'zod';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Alert } from '~/components/ui/alert';

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
});

const schema = z.object({ email: z.string().email() });
type FormData = z.infer<typeof schema>;

function ForgotPasswordPage() {
  const { t } = useTranslation('auth');
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(_data: FormData) {
    // TODO: wire up Better Auth requestPasswordReset()
    setSent(true);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">{t('forgotPassword.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('forgotPassword.subtitle')}</p>
      </div>

      {sent ? (
        <Alert tone="success">{t('forgotPassword.success')}</Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label={t('forgotPassword.email')} error={errors.email?.message}>
            {({ id, 'aria-describedby': describedBy, invalid }) => (
              <Input
                id={id}
                type="email"
                autoComplete="email"
                aria-describedby={describedBy}
                invalid={invalid}
                {...register('email')}
              />
            )}
          </Field>

          <Button type="submit" className="w-full" loading={isSubmitting}>
            {t('forgotPassword.submit')}
          </Button>
        </form>
      )}

      <p className="text-center text-sm">
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
          {t('forgotPassword.backToSignIn')}
        </Link>
      </p>
    </div>
  );
}
