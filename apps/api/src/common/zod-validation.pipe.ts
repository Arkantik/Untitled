import { PipeTransform } from '@nestjs/common';
import type { z } from 'zod';
import { validationError } from './app.exception.js';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) throw validationError(result.error.issues);
    return result.data;
  }
}
