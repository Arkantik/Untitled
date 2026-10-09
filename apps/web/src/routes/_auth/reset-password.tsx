import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '~/lib/zod-resolver';
import { z } from 'zod';
import { passwordSchema } from '@veypost/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from '~/components/ui/field';
import { PasswordInput } from '~/components/ui/password-input';
import { Button } from '~/components/ui/button';
import { Alert } from '~/components/ui/alert';

export const Route = createFileRoute('/_auth/reset-password')({
  component: ResetPasswordPage,
});

const schema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordPage() {
  const { t } = useTranslation('auth');
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(_data: FormData) {
    // TODO: wire up Better Auth resetPassword()
    setDone(true);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">{t('resetPassword.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('resetPassword.subtitle')}</p>
      </div>

      {done ? (
        <div className="space-y-4">
          <Alert tone="success">{t('resetPassword.success')}</Alert>
          <Link
            to="/login"
            className="block text-center text-sm font-medium text-primary hover:underline"
          >
            {t('forgotPassword.backToSignIn')}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label={t('resetPassword.newPassword')} error={errors.newPassword?.message}>
            {({ id, 'aria-describedby': describedBy, invalid }) => (
              <PasswordInput
                id={id}
                autoComplete="new-password"
                aria-describedby={describedBy}
                invalid={invalid}
                {...register('newPassword')}
              />
            )}
          </Field>

          <Field label={t('resetPassword.confirmPassword')} error={errors.confirmPassword?.message}>
            {({ id, 'aria-describedby': describedBy, invalid }) => (
              <PasswordInput
                id={id}
                autoComplete="new-password"
                aria-describedby={describedBy}
                invalid={invalid}
                {...register('confirmPassword')}
              />
            )}
          </Field>

          <Button type="submit" className="w-full" loading={isSubmitting}>
            {t('resetPassword.submit')}
          </Button>
        </form>
      )}
    </div>
  );
}
