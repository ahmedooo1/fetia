import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { Card } from './card.entity';
import { Rsvp } from './rsvp.entity';
import { TemplatesService } from '../templates/templates.service';
import { MailService, emailButton, escapeHtml, renderEmail } from '../mail/mail.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateRsvpDto } from './dto/create-rsvp.dto';

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);

  constructor(
    @InjectRepository(Card) private readonly cardsRepo: Repository<Card>,
    @InjectRepository(Rsvp) private readonly rsvpsRepo: Repository<Rsvp>,
    private readonly templatesService: TemplatesService,
    private readonly mailService: MailService,
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
    const card = await this.cardsRepo.findOne({ where: { slug }, relations: ['owner'] });
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
    this.notifyOwnerOfRsvp(card, rsvp).catch(() => undefined); // best-effort, ne bloque pas la reponse a l'invite
    return { ok: true };
  }

  private async notifyOwnerOfRsvp(card: Card, rsvp: Rsvp) {
    if (!this.mailService.isConfigured() || !card.owner?.email) return;

    const cardTitle = (card.data as any)?.title || card.template?.name || 'ta carte';
    const rsvpsUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cards/${card.id}/rsvps`;

    const body = `
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#C98A4B;">Nouvelle reponse</p>
      <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B0E2E;">${escapeHtml(rsvp.name)} a repondu</h1>
      <p style="margin:0 0 4px;color:#3A3226;">
        ${rsvp.attending
          ? `Sera present${rsvp.guests > 1 ? ` (${rsvp.guests} personnes)` : ''}.`
          : 'Ne pourra pas venir.'}
      </p>
      <p style="margin:0 0 16px;color:#3A3226;">Pour ta carte <strong>${escapeHtml(cardTitle)}</strong>.</p>
      ${rsvp.message ? `<div style="padding:16px 18px;background:#FAF7F1;border-radius:12px;border:1px solid #EAE3D6;color:#3A3226;font-size:14px;line-height:1.6;margin-bottom:16px;">${escapeHtml(rsvp.message).replace(/\n/g, '<br>')}</div>` : ''}
      ${emailButton(escapeHtml(rsvpsUrl), 'Voir toutes les reponses')}
    `;

    try {
      await this.mailService.send({
        to: card.owner.email,
        subject: `${rsvp.name} a repondu a ton invitation`,
        text: `${rsvp.name} ${rsvp.attending ? 'sera present' : 'ne pourra pas venir'}${rsvp.message ? `\n\nMessage : ${rsvp.message}` : ''}\n\nVoir toutes les reponses : ${rsvpsUrl}`,
        html: renderEmail(body),
      });
    } catch (err) {
      this.logger.error('Echec envoi notification RSVP', err as Error);
    }
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
