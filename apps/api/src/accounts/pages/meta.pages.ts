import type { StoredPageOption } from '../accounts.helpers.js';

export async function fetchMetaPages(userAccessToken: string): Promise<StoredPageOption[]> {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,profile_picture_url}&access_token=${userAccessToken}`,
  );
  if (!res.ok) throw new Error('Failed to fetch Facebook pages');

  const data = (await res.json()) as {
    data?: Array<{
      id: string;
      name: string;
      access_token: string;
      instagram_business_account?: { id: string; username?: string; profile_picture_url?: string };
    }>;
  };

  const pages: StoredPageOption[] = [];

  for (const page of data.data ?? []) {
    pages.push({
      id: page.id,
      name: page.name,
      platformType: 'facebook',
      avatarUrl: `https://graph.facebook.com/v21.0/${page.id}/picture?type=square`,
      accessToken: page.access_token,
    });

    if (page.instagram_business_account) {
      const ig = page.instagram_business_account;
      pages.push({
        id: ig.id,
        name: ig.username ? `@${ig.username}` : `Instagram (${page.name})`,
        platformType: 'instagram',
        avatarUrl: ig.profile_picture_url ?? null,
        accessToken: page.access_token,
      });
    }
  }

  return pages;
}
