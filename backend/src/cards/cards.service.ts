import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { Card } from './card.entity';
import { TemplatesService } from '../templates/templates.service';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private readonly cardsRepo: Repository<Card>,
    private readonly templatesService: TemplatesService,
  ) {}

  async create(ownerId: string, dto: CreateCardDto) {
    const template = await this.templatesService.findOne(dto.templateId);
    if (!template) throw new NotFoundException('Modele introuvable');

    const card = this.cardsRepo.create({
      slug: nanoid(10),
      owner: { id: ownerId } as any,
      template,
      data: dto.data,
      isUnlocked: !template.isPremium,
    });
    return this.cardsRepo.save(card);
  }

  findMine(ownerId: string) {
    return this.cardsRepo.find({
      where: { owner: { id: ownerId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySlug(slug: string) {
    const card = await this.cardsRepo.findOne({ where: { slug } });
    if (!card) throw new NotFoundException('Carte introuvable');
    return card;
  }

  async unlock(cardId: string) {
    await this.cardsRepo.update(cardId, { isUnlocked: true });
    return this.cardsRepo.findOne({ where: { id: cardId } });
  }

  findOne(id: string) {
    return this.cardsRepo.findOne({ where: { id } });
  }
}
