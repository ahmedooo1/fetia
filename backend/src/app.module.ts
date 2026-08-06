import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TemplatesModule } from './templates/templates.module';
import { CardsModule } from './cards/cards.module';
import { PaymentsModule } from './payments/payments.module';
import { UploadsModule } from './uploads/uploads.module';
import { ContactModule } from './contact/contact.module';
import { HealthModule } from './health/health.module';
import { User } from './users/user.entity';
import { CardTemplate } from './templates/template.entity';
import { Card } from './cards/card.entity';
import { Rsvp } from './cards/rsvp.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60 * 1000, limit: 20 }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, CardTemplate, Card, Rsvp],
      synchronize: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    TemplatesModule,
    CardsModule,
    PaymentsModule,
    UploadsModule,
    ContactModule,
    HealthModule,
  ],
})
export class AppModule {}
