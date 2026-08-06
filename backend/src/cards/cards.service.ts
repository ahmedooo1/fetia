import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { Card } from './card.entity';
import { Rsvp } from './rsvp.entity';
import { TemplatesService } from '../templates/templates.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateRsvpDto } from './dto/create-rsvp.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private readonly cardsRepo: Repository<Card>,
    @InjectRepository(Rsvp) private readonly rsvpsRepo: Repository<Rsvp>,
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
    // compteur de vues (best effort, pas bloquant)
    this.cardsRepo.increment({ id: card.id }, 'views', 1).catch(() => undefined);
    return card;
  }

  private async findOwned(id: string, ownerId: string) {
    const card = await this.cardsRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!card) throw new NotFoundException('Carte introuvable');
    if (card.owner.id !== ownerId) throw new ForbiddenException();
    return card;
  }

  async findOneOwned(id: string, ownerId: string) {
    const card = await this.findOwned(id, ownerId);
    const { owner, ...rest } = card as any;
    return rest;
  }

  async update(id: string, ownerId: string, dto: UpdateCardDto) {
    const card = await this.findOwned(id, ownerId);
    if (dto.data) card.data = dto.data;
    if (dto.rsvpEnabled !== undefined) card.rsvpEnabled = dto.rsvpEnabled;
    return this.cardsRepo.save(card);
  }

  async remove(id: string, ownerId: string) {
    const card = await this.findOwned(id, ownerId);
    await this.cardsRepo.remove(card);
    return { deleted: true };
  }

  async unlock(cardId: string) {
    await this.cardsRepo.update(cardId, { isUnlocked: true });
    return this.cardsRepo.findOne({ where: { id: cardId } });
  }

  findOne(id: string) {
    return this.cardsRepo.findOne({ where: { id } });
  }

  // ---- RSVP ----
  async createRsvp(slug: string, dto: CreateRsvpDto) {
    const card = await this.cardsRepo.findOne({ where: { slug } });
    if (!card) throw new NotFoundException('Carte introuvable');
    if (!card.isUnlocked || !card.rsvpEnabled) {
      throw new ForbiddenException('Les reponses ne sont pas ouvertes pour cette carte');
    }
    const rsvp = this.rsvpsRepo.create({
      card: { id: card.id } as any,
      name: dto.name,
      attending: dto.attending,
      guests: dto.guests ?? 1,
      message: dto.message,
    });
    await this.rsvpsRepo.save(rsvp);
    return { ok: true };
  }

  async listRsvps(cardId: string, ownerId: string) {
    await this.findOwned(cardId, ownerId);
    const rsvps = await this.rsvpsRepo.find({
      where: { card: { id: cardId } },
      order: { createdAt: 'DESC' },
    });
    const attending = rsvps.filter((r) => r.attending);
    const declined = rsvps.filter((r) => !r.attending);
    return {
      rsvps,
      stats: {
        total: rsvps.length,
        attending: attending.length,
        declined: declined.length,
        totalGuests: attending.reduce((sum, r) => sum + (r.guests || 1), 0),
      },
    };
  }
}
