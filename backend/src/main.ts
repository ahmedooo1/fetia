import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

function checkProductionSafety(logger: Logger) {
  if (process.env.NODE_ENV !== 'production') return;
  const problems: string[] = [];
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change-me-in-production') {
    problems.push('JWT_SECRET utilise la valeur par defaut');
  }
  if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.includes('localhost')) {
    problems.push('FRONTEND_URL pointe encore vers localhost');
  }
  if (process.env.STRIPE_SECRET_KEY === 'sk_test_xxx') {
    problems.push('STRIPE_SECRET_KEY utilise la valeur de test par defaut');
  }
  if (problems.length) {
    logger.warn(`ATTENTION - configuration de production incomplete: ${problems.join('; ')}`);
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  checkProductionSafety(logger);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Fetia API running on http://localhost:${port}/api`);
}
bootstrap();
