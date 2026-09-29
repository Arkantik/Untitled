import { useRouteContext } from '@tanstack/react-router';

export function useCurrentUser() {
  return useRouteContext({ from: '/_app', select: (ctx) => ctx.user });
}
