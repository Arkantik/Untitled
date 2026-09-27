import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Field } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { PasswordInput } from '~/components/ui/password-input';
import { Button } from '~/components/ui/button';
import { toast } from '~/components/ui/sonner';

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginData = z.infer<typeof loginSchema>;

function LoginPage() {
  const { t } = useTranslation('auth');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(_data: LoginData) {
    // TODO: wire up Better Auth signIn.email()
    toast.error('Auth not yet connected.');
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">{t('login.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('login.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label={t('login.email')} error={errors.email?.message}>
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

        <Field label={t('login.password')} error={errors.password?.message}>
          {({ id, 'aria-describedby': describedBy, invalid }) => (
            <PasswordInput
              id={id}
              autoComplete="current-password"
              aria-describedby={describedBy}
              invalid={invalid}
              {...register('password')}
            />
          )}
        </Field>

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('login.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {t('login.submit')}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('login.noAccount')}{' '}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline"
        >
          {t('login.signUpLink')}
        </Link>
      </p>
    </div>
  );
}
