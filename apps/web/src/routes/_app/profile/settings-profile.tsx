import { useState, useRef } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Field } from '~/components/ui/field';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { toast } from '~/components/ui/toast';
import { useCurrentUser } from '~/hooks/use-session';
import { useTheme } from '~/hooks/use-theme';
import { useUpdateProfile, useUploadAvatar, useRemoveAvatar, useDeleteAccount, useUserProfile } from '~/hooks/use-profile';
import { cn } from '~/lib/utils';

import type { ThemePref } from '~/hooks/use-theme';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 2;
const THEME_OPTIONS: { id: ThemePref; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
];

function ThemePreview({ variant }: { variant: ThemePref }) {
  const isDark = variant === 'dark';
  const isSystem = variant === 'system';
  return (
    <div className={cn('w-16 h-10 rounded border overflow-hidden flex flex-col', isDark ? 'bg-zinc-900' : isSystem ? 'bg-linear-to-br from-white to-zinc-800' : 'bg-white')}>
      <div className={cn('h-2.5 flex items-center gap-0.5 px-1', isDark ? 'bg-zinc-800' : 'bg-zinc-100')}>
        {[0, 1, 2].map((i) => <div key={i} className={cn('size-1 rounded-full', isDark ? 'bg-zinc-600' : 'bg-zinc-300')} />)}
      </div>
      <div className="flex-1 p-1 flex flex-col gap-0.5">
        <div className={cn('h-1 rounded-full w-8', isDark ? 'bg-zinc-700' : 'bg-zinc-200')} />
        <div className={cn('h-1 rounded-full w-5', isDark ? 'bg-zinc-700' : 'bg-zinc-200')} />
      </div>
    </div>
  );
}

export function ProfilePanel() {
  const user = useCurrentUser();
  const profile = useUserProfile();
  const router = useRouter();
  const { pref, setTheme, clearTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingFile = useRef<File | null>(null);

  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();
  const deleteAccount = useDeleteAccount();

  const [form, setForm] = useState(() => ({
    firstName: user.name?.split(' ')[0] ?? '',
    lastName: user.name?.split(' ').slice(1).join(' ') ?? '',
    preview: null as string | null,
  }));
  const [dialog, setDialog] = useState({ open: false, confirm: '' });

  function patch(fields: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...fields }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) { toast.error('Only JPG, PNG, and WebP files are accepted.'); return; }
    if (file.size > MAX_MB * 1024 * 1024) { toast.error(`File must be under ${MAX_MB} MB.`); return; }
    pendingFile.current = file;
    patch({ preview: URL.createObjectURL(file) });
    e.target.value = '';
  }

  function handleTheme(next: ThemePref) {
    if (next === 'system') { clearTheme(); } else { setTheme(next); }
  }

  async function handleSave() {
    if (pendingFile.current) {
      await uploadAvatar.mutateAsync(pendingFile.current);
      pendingFile.current = null;
    }
    const name = `${form.firstName} ${form.lastName}`.trim();
    if (name) {
      await updateProfile.mutateAsync({ name });
    }
    toast.success('Profile saved.');
    router.invalidate();
  }

  async function handleDeleteAccount() {
    await deleteAccount.mutateAsync();
    await router.navigate({ to: '/login' });
  }

  const savedAvatarUrl = profile.avatarUrl ?? profile.image;
  const hasAvatar = !!(form.preview ?? savedAvatarUrl);

  async function handleRemove() {
    await removeAvatar.mutateAsync();
    pendingFile.current = null;
    patch({ preview: null });
    router.invalidate();
  }

  const isSaving = uploadAvatar.isPending || updateProfile.isPending;
  const initials = [form.firstName[0], form.lastName[0]].filter(Boolean).join('').toUpperCase() || user.name?.[0]?.toUpperCase() || '?';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your name, photo, and appearance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-lg font-semibold text-muted-foreground">
              {initials}
              {(form.preview ?? savedAvatarUrl) && (
                <img
                  src={form.preview ?? savedAvatarUrl ?? ''}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full rounded-full object-cover"
                />
              )}
            </span>
            <div className="flex flex-col gap-1.5">
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" type="button" onClick={() => fileRef.current?.click()}>Upload photo</Button>
                {hasAvatar && (
                  <Button variant="ghost" size="sm" type="button" className="text-muted-foreground"
                    disabled={removeAvatar.isPending} onClick={() => void handleRemove()}>
                    Remove
                  </Button>
                )}
              </div>
              <span className="text-xs text-muted-foreground">JPG, PNG or WebP · 2 MB max</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name">
              {(props) => <Input {...props} type="text" value={form.firstName} onChange={(e) => patch({ firstName: e.target.value })} />}
            </Field>
            <Field label="Last name">
              {(props) => <Input {...props} type="text" value={form.lastName} onChange={(e) => patch({ lastName: e.target.value })} />}
            </Field>
          </div>
          <Field label="Email" hint="Contact support to change your email.">
            {(props) => <Input {...props} type="email" value={user.email} readOnly className="opacity-60 cursor-default" />}
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium">Theme</p>
            <div className="flex gap-3">
              {THEME_OPTIONS.map((opt) => (
                <button key={opt.id} type="button" aria-pressed={pref === opt.id} onClick={() => handleTheme(opt.id)}
                  className={cn('flex flex-col items-center gap-1.5 rounded-lg border-2 p-2.5 text-xs font-medium transition-colors',
                    pref === opt.id ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-muted-foreground/50')}>
                  <ThemePreview variant={opt.id} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2 border-t border-border px-6 py-4">
          <Button type="button" disabled={isSaving} onClick={() => void handleSave()}>
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive">
        <CardHeader className="border-b border-destructive/30">
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Irreversible actions. Proceed with care.</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex flex-col gap-4 compact:flex-row compact:items-center compact:justify-between">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-sm text-muted-foreground">Permanently deletes your account and all data you own. Cannot be undone.</p>
            </div>
            <Dialog open={dialog.open} onOpenChange={(o) => setDialog(o ? { open: true, confirm: '' } : { open: false, confirm: '' })}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" type="button" className="shrink-0">Delete account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete account</DialogTitle>
                  <DialogDescription>This permanently deletes your account and cannot be undone.</DialogDescription>
                </DialogHeader>
                <Field label='Type "delete my account" to confirm'>
                  {(props) => <Input {...props} type="text" value={dialog.confirm} onChange={(e) => setDialog((d) => ({ ...d, confirm: e.target.value }))} />}
                </Field>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setDialog({ open: false, confirm: '' })}>Cancel</Button>
                  <Button variant="destructive" type="button"
                    disabled={dialog.confirm !== 'delete my account' || deleteAccount.isPending}
                    onClick={() => void handleDeleteAccount()}>
                    {deleteAccount.isPending ? 'Deleting…' : 'Delete account'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
