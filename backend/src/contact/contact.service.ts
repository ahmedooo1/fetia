import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { MailService, escapeHtml } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

const MIN_FILL_TIME_MS = 2500;
const stripControlChars = (value: string) => value.replace(/[\r\n\t]/g, ' ').trim();

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly mailService: MailService) {}

  async send(dto: CreateContactDto) {
    // honeypot rempli ou formulaire soumis trop vite -> probable bot,
    // on repond succes sans rien envoyer pour ne pas aider le bot a s'adapter
    const tooFast = dto.startedAt && Date.now() - dto.startedAt < MIN_FILL_TIME_MS;
    if (dto.website || tooFast) {
      this.logger.warn(`Message de contact ignore (anti-spam) depuis ${dto.email}`);
      return { ok: true };
    }

    if (!this.mailService.isConfigured()) {
      this.logger.error('SMTP non configure : SMTP_HOST/SMTP_USER/SMTP_PASS manquants');
      throw new ServiceUnavailableException(
        "Le formulaire de contact n'est pas disponible pour le moment.",
      );
    }

    const name = stripControlChars(dto.name).slice(0, 80);
    const email = stripControlChars(dto.email).slice(0, 160);
    const message = dto.message.trim();
    const notifyTo = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

    try {
      await this.mailService.send({
        to: notifyTo as string,
        replyTo: `"${name}" <${email}>`,
        subject: `Nouveau message de contact - ${name}`,
        text: `De : ${name} (${email})\n\n${message}`,
        html: `<p><strong>De :</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      });
    } catch (err) {
      this.logger.error('Echec envoi email de contact', err as Error);
      throw new ServiceUnavailableException("L'envoi a echoue, reessaie plus tard.");
    }

    return { ok: true };
  }
}
