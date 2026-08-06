import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TemplatesModule } from './templates/templates.module';
import { CardsModule } from './cards/cards.module';
import { PaymentsModule } from './payments/payments.module';
import { User } from './users/user.entity';
import { CardTemplate } from './templates/template.entity';
import { Card } from './cards/card.entity';
import { Rsvp } from './cards/rsvp.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
})
export class AppModule {}
