import type { SocialPlatform } from '@veypost/shared';
import type { OAuthPlatform } from './oauth.connector.js';

export interface ProfileResult {
  platform: SocialPlatform;
  platformAccountId: string;
  platformUsername: string | null;
  avatarUrl: string | null;
}

export async function fetchOAuthProfile(
  platform: OAuthPlatform,
  accessToken: string,
): Promise<ProfileResult> {
  switch (platform) {
    case 'x':
      return fetchXProfile(accessToken);
    case 'linkedin':
      return fetchLinkedInProfile(accessToken);
    case 'threads':
      return fetchThreadsProfile(accessToken);
    case 'facebook':
      return fetchMetaProfile(accessToken);
  }
}

async function fetchXProfile(accessToken: string): Promise<ProfileResult> {
  const res = await fetch(
    'https://api.twitter.com/2/users/me?user.fields=profile_image_url',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) throw new Error('Failed to fetch X profile');
  const { data } = (await res.json()) as { data: { id: string; username: string; profile_image_url?: string } };
  return {
    platform: 'x',
    platformAccountId: data.id,
    platformUsername: data.username,
    avatarUrl: data.profile_image_url ?? null,
  };
}

async function fetchLinkedInProfile(accessToken: string): Promise<ProfileResult> {
  const res = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch LinkedIn profile');
  const data = (await res.json()) as { sub: string; name?: string; picture?: string };
  return {
    platform: 'linkedin',
    platformAccountId: data.sub,
    platformUsername: data.name ?? null,
    avatarUrl: data.picture ?? null,
  };
}

async function fetchThreadsProfile(accessToken: string): Promise<ProfileResult> {
  const res = await fetch(
    `https://graph.threads.net/me?fields=id,username,threads_profile_picture_url&access_token=${accessToken}`,
  );
  if (!res.ok) throw new Error('Failed to fetch Threads profile');
  const data = (await res.json()) as { id: string; username?: string; threads_profile_picture_url?: string };
  return {
    platform: 'threads',
    platformAccountId: data.id,
    platformUsername: data.username ?? null,
    avatarUrl: data.threads_profile_picture_url ?? null,
  };
}

async function fetchMetaProfile(accessToken: string): Promise<ProfileResult> {
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`,
  );
  if (pagesRes.ok) {
    const pages = (await pagesRes.json()) as { data?: { id: string; name: string }[] };
    const page = pages.data?.[0];
    if (page) {
      return {
        platform: 'facebook',
        platformAccountId: page.id,
        platformUsername: page.name,
        avatarUrl: `https://graph.facebook.com/v21.0/${page.id}/picture?type=square`,
      };
    }
  }
  const userRes = await fetch(
    `https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${accessToken}`,
  );
  if (!userRes.ok) throw new Error('Failed to fetch Meta profile');
  const user = (await userRes.json()) as { id: string; name?: string };
  return {
    platform: 'facebook',
    platformAccountId: user.id,
    platformUsername: user.name ?? null,
    avatarUrl: `https://graph.facebook.com/v21.0/${user.id}/picture?type=square`,
  };
}
