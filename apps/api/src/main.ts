import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { Readable } from 'node:stream';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import staticPlugin from '@fastify/static';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { APP_NAME, APP_DESCRIPTION } from '@veypost/shared';
import { auth } from './lib/auth.js';
import { AppExceptionFilter } from './common/app-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 5 * 1024 * 1024 }),
  );

  app.useGlobalFilters(new AppExceptionFilter());

  const uploadDir = resolve(process.cwd(), process.env.UPLOAD_DIR ?? './data/uploads');
  mkdirSync(resolve(uploadDir, 'avatars'), { recursive: true });
  mkdirSync(resolve(uploadDir, 'workspace-avatars'), { recursive: true });
  await app.register(staticPlugin as Parameters<typeof app.register>[0], {
    root: uploadDir,
    prefix: '/static/',
    decorateReply: false,
  });

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    credentials: true,
  });

  type RawRequest = FastifyRequest & { rawBody?: Buffer };

  // Capture raw body for Stripe webhook HMAC verification before JSON parsing.
  app.getHttpAdapter().getInstance().addHook('preParsing', async (request: RawRequest, _reply: FastifyReply, payload: Readable) => {
    if (request.url === '/api/v1/billing/webhook') {
      const chunks: Buffer[] = [];
      for await (const chunk of payload) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array));
      }
      request.rawBody = Buffer.concat(chunks);
      return Readable.from(request.rawBody);
    }
    return payload;
  });

  // Mount Better Auth after NestJS init so the JSON body parser is in place.
  // Fastify has already parsed req.body by the time this handler runs.
  app.getHttpAdapter().getInstance().all('/api/auth/*', async (req: FastifyRequest, reply: FastifyReply) => {
    const url = `http://${req.headers.host}${req.url}`;
    const hasBody = !['GET', 'HEAD'].includes((req.method as string).toUpperCase());
    const webReq = new Request(url, {
      method: req.method as string,
      headers: new Headers(req.headers as Record<string, string>),
      body: hasBody && req.body != null ? JSON.stringify(req.body) : undefined,
    });
    const webRes = await auth.handler(webReq);
    reply.status(webRes.status);
    webRes.headers.forEach((v: string, k: string) => {
      if (k.toLowerCase() !== 'content-length') reply.header(k, v);
    });
    return reply.send(await webRes.text());
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${APP_NAME} API`)
    .setDescription(APP_DESCRIPTION)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`${APP_NAME} API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
