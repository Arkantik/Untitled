import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from './use-api-mutation';
import { useApiQuery } from './use-api-query';
import { apiFetch, isApiError } from '~/lib/api-client';
import { toast } from '~/components/ui/toast';
import { useCurrentUser } from './use-session';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  image: string | null;
}

const USER_KEY = ['users', 'me'] as const;

export function useUserProfile(): UserProfile {
  const session = useCurrentUser();
  const sessionData: UserProfile = {
    id: session.id,
    email: session.email,
    name: session.name,
    avatarUrl: session.image ?? null,
    image: session.image ?? null,
  };
  const { data } = useApiQuery<UserProfile>(USER_KEY, '/api/v1/users/me', {
    initialData: sessionData,
    initialDataUpdatedAt: 0,
  });
  return data ?? sessionData;
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useApiMutation<UserProfile, { name: string }>('PATCH', '/api/v1/users/me', {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEY });
    },
    onError: (e) => {
      toast.error(isApiError(e) ? e.message : 'Failed to save profile.');
    },
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation<{ avatarUrl: string }, Error, File>({
    mutationFn: async (file) => {
      const data = await fileToDataUrl(file);
      const res = await fetch('/api/v1/users/me/avatar', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, mimetype: file.type }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? 'Failed to upload avatar.');
      }
      return res.json() as Promise<{ avatarUrl: string }>;
    },
    onError: (e) => toast.error(e.message),
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_KEY }),
  });
}

export function useRemoveAvatar() {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => apiFetch('/api/v1/users/me/avatar', { method: 'DELETE' }),
    onError: (e) => toast.error(isApiError(e) ? e.message : 'Failed to remove avatar.'),
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_KEY }),
  });
}

export function useChangePassword() {
  return useApiMutation<void, { currentPassword: string; newPassword: string }>(
    'PATCH',
    '/api/v1/users/me/password',
    {
      onSuccess: () => toast.success('Password updated.'),
      onError: (e) => toast.error(isApiError(e) ? e.message : 'Failed to update password.'),
    },
  );
}

export function useDeleteAccount() {
  return useMutation<void, Error, void>({
    mutationFn: () => apiFetch('/api/v1/users/me', { method: 'DELETE' }),
    onError: (e) => toast.error(e.message),
  });
}
