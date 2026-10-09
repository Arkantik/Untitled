import { getEnv } from '../../config/env.js';
import { badRequest } from '../../common/app.exception.js';

export type OAuthPlatform = 'x' | 'linkedin' | 'threads' | 'facebook';

export function isOAuthPlatform(p: string): p is OAuthPlatform {
  return ['x', 'linkedin', 'threads', 'facebook'].includes(p);
}

interface PlatformConfig {
  authUrl: string;
  tokenUrl: string;
  scopes: string;
  usePkce: boolean;
  useBasicAuth: boolean;
}

const CONFIG: Record<OAuthPlatform, PlatformConfig> = {
  x: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: 'tweet.read tweet.write users.read offline.access',
    usePkce: true,
    useBasicAuth: true,
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: 'openid profile email w_member_social',
    usePkce: false,
    useBasicAuth: false,
  },
  threads: {
    authUrl: 'https://www.threads.net/oauth/authorize',
    tokenUrl: 'https://graph.threads.net/oauth/access_token',
    scopes: 'threads_basic,threads_content_publish',
    usePkce: false,
    useBasicAuth: false,
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v21.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v21.0/oauth/access_token',
    scopes: 'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish',
    usePkce: false,
    useBasicAuth: false,
  },
};

function getCredentials(platform: OAuthPlatform): { clientId: string; clientSecret: string } {
  const env = getEnv();
  const map: Record<OAuthPlatform, { id?: string; secret?: string }> = {
    x: { id: env.X_CLIENT_ID, secret: env.X_CLIENT_SECRET },
    linkedin: { id: env.LINKEDIN_CLIENT_ID, secret: env.LINKEDIN_CLIENT_SECRET },
    threads: { id: env.THREADS_APP_ID, secret: env.THREADS_APP_SECRET },
    facebook: { id: env.FACEBOOK_APP_ID, secret: env.FACEBOOK_APP_SECRET },
  };
  const creds = map[platform];
  if (!creds.id || !creds.secret) {
    throw badRequest(`${platform} OAuth is not configured. Set the required environment variables.`);
  }
  return { clientId: creds.id, clientSecret: creds.secret };
}

export function generateVerifier(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function generateChallenge(verifier: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function buildOAuthUrl(
  platform: OAuthPlatform,
  redirectUri: string,
  state: string,
  verifier: string,
): Promise<string> {
  const { clientId } = getCredentials(platform);
  const cfg = CONFIG[platform];
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: cfg.scopes,
    state,
  });
  if (cfg.usePkce) {
    params.set('code_challenge', await generateChallenge(verifier));
    params.set('code_challenge_method', 'S256');
  }
  return `${cfg.authUrl}?${params}`;
}

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export async function exchangeOAuthCode(
  platform: OAuthPlatform,
  code: string,
  redirectUri: string,
  verifier: string,
): Promise<OAuthTokens> {
  const { clientId, clientSecret } = getCredentials(platform);
  const cfg = CONFIG[platform];

  const body = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, client_id: clientId });
  if (cfg.usePkce) body.set('code_verifier', verifier);
  else body.set('client_secret', clientSecret);

  const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (cfg.useBasicAuth) headers['Authorization'] = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;

  const res = await fetch(cfg.tokenUrl, { method: 'POST', headers, body: body.toString() });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error_description?: string };
    throw new Error(err.error_description ?? 'Token exchange failed');
  }
  const tokens = (await res.json()) as OAuthTokens;

  if (platform === 'threads') {
    const ltRes = await fetch(`https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${clientSecret}&access_token=${tokens.access_token}`);
    if (ltRes.ok) return (await ltRes.json()) as OAuthTokens;
  }

  if (platform === 'facebook') {
    const ltRes = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${tokens.access_token}`);
    if (ltRes.ok) return (await ltRes.json()) as OAuthTokens;
  }

  return tokens;
}
