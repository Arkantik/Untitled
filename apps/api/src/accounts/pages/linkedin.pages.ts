import type { StoredPageOption } from '../accounts.helpers.js';

export async function fetchLinkedInPages(accessToken: string): Promise<StoredPageOption[]> {
  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!profileRes.ok) throw new Error('Failed to fetch LinkedIn profile');
  const profile = (await profileRes.json()) as { sub: string; name?: string; picture?: string };

  const pages: StoredPageOption[] = [{
    id: profile.sub,
    name: profile.name ?? 'My LinkedIn Profile',
    platformType: 'linkedin',
    avatarUrl: profile.picture ?? null,
    accessToken,
  }];

  try {
    const orgsRes = await fetch(
      'https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (orgsRes.ok) {
      const orgs = (await orgsRes.json()) as { elements?: { organizationalTarget: string }[] };
      for (const el of orgs.elements ?? []) {
        const parts = el.organizationalTarget.split(':');
        const orgId = parts[parts.length - 1];
        const orgRes = await fetch(
          `https://api.linkedin.com/v2/organizations/${orgId}?projection=(id,localizedName)`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        if (orgRes.ok) {
          const org = (await orgRes.json()) as { id: number; localizedName?: string };
          pages.push({
            id: String(org.id),
            name: org.localizedName ?? `Company Page ${org.id}`,
            platformType: 'linkedin',
            avatarUrl: null,
            accessToken,
          });
        }
      }
    }
  } catch {}

  return pages;
}
