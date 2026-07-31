import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), TemplatesModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
