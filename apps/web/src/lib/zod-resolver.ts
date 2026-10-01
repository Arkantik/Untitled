import type { Resolver, FieldErrors } from 'react-hook-form';
import type { ZodType } from 'zod';

type FlatErrors = Record<string, { message: string; type: string }>;

function toNestedErrors(flat: FlatErrors): FieldErrors {
  const result: Record<string, unknown> = {};
  for (const [path, error] of Object.entries(flat)) {
    const parts = path.split('.');
    let cursor = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cursor[parts[i]]) cursor[parts[i]] = {};
      cursor = cursor[parts[i]] as Record<string, unknown>;
    }
    cursor[parts[parts.length - 1]] = error;
  }
  return result as FieldErrors;
}

export function zodResolver<T extends ZodType>(schema: T): Resolver {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return { values: result.data as Record<string, unknown>, errors: {} };
    }
    const flat: FlatErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.') || '_';
      if (!flat[key]) {
        flat[key] = { message: issue.message, type: issue.code as string };
      }
    }
    return { values: {}, errors: toNestedErrors(flat) };
  };
}
