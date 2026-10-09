import { badRequest } from '../../common/app.exception.js';

export interface ConnectorResult {
  platformAccountId: string;
  platformUsername: string | null;
  avatarUrl: string | null;
  accessToken: string;
  refreshToken: null;
  tokenExpiresAt: null;
}

const DISCORD_WEBHOOK_RE = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;

export async function connectDiscord(webhookUrl: string): Promise<ConnectorResult> {
  if (!DISCORD_WEBHOOK_RE.test(webhookUrl)) {
    throw badRequest(
      'Invalid Discord webhook URL. Copy it from channel settings → Integrations → Webhooks.',
    );
  }

  const res = await fetch(webhookUrl);
  if (!res.ok) {
    throw badRequest(
      'Could not verify Discord webhook. Check the URL is correct and the webhook is not deleted.',
    );
  }

  const data = (await res.json()) as {
    id: string;
    name: string | null;
    avatar: string | null;
  };

  const avatarUrl = data.avatar
    ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
    : null;

  return {
    platformAccountId: data.id,
    platformUsername: data.name ?? null,
    avatarUrl,
    accessToken: webhookUrl,
    refreshToken: null,
    tokenExpiresAt: null,
  };
}
