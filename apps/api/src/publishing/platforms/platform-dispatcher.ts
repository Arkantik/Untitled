import { Injectable } from '@nestjs/common';
import type { SocialPlatform } from '@veypost/shared';

export interface DispatchInput {
  platform: SocialPlatform;
  content: string;
  accessToken: string;
  refreshToken: string | null;
}

export interface DispatchResult {
  platformPostId?: string;
}

export abstract class PlatformDispatcher {
  abstract dispatch(input: DispatchInput): Promise<DispatchResult>;
}

@Injectable()
export class StubPlatformDispatcher extends PlatformDispatcher {
  async dispatch(input: DispatchInput): Promise<DispatchResult> {
    throw new Error(`Platform dispatcher for ${input.platform} not implemented — see ticket 003`);
  }
}
