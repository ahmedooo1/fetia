import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { Rsvp } from './rsvp.entity';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TemplatesModule } from '../templates/templates.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Rsvp]), TemplatesModule, MailModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
