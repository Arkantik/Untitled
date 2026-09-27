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

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
});

const registerSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(1),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterData = z.infer<typeof registerSchema>;

function RegisterPage() {
  const { t } = useTranslation('auth');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(_data: RegisterData) {
    // TODO: wire up Better Auth signUp.email()
    toast.error('Auth not yet connected.');
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">{t('register.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('register.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label={t('register.name')} error={errors.name?.message}>
          {({ id, 'aria-describedby': describedBy, invalid }) => (
            <Input
              id={id}
              type="text"
              autoComplete="name"
              aria-describedby={describedBy}
              invalid={invalid}
              {...register('name')}
            />
          )}
        </Field>

        <Field label={t('register.email')} error={errors.email?.message}>
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

        <Field label={t('register.password')} error={errors.password?.message}>
          {({ id, 'aria-describedby': describedBy, invalid }) => (
            <PasswordInput
              id={id}
              autoComplete="new-password"
              aria-describedby={describedBy}
              invalid={invalid}
              {...register('password')}
            />
          )}
        </Field>

        <Field label={t('register.confirmPassword')} error={errors.confirmPassword?.message}>
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
          {t('register.submit')}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('register.hasAccount')}{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          {t('register.signInLink')}
        </Link>
      </p>
    </div>
  );
}
