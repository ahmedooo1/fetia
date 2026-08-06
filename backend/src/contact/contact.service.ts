import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { MailService, escapeHtml, renderEmail } from '../mail/mail.service';
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

    const body = `
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#C98A4B;">Nouveau message</p>
      <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B0E2E;">Formulaire de contact</h1>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:20px;">
        <tr>
          <td style="padding:4px 0;color:#9A8F7A;font-size:13px;width:70px;">Nom</td>
          <td style="padding:4px 0;color:#3A3226;font-size:14px;font-weight:600;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#9A8F7A;font-size:13px;">Email</td>
          <td style="padding:4px 0;color:#3A3226;font-size:14px;font-weight:600;">${escapeHtml(email)}</td>
        </tr>
      </table>
      <div style="padding:16px 18px;background:#FAF7F1;border-radius:12px;border:1px solid #EAE3D6;color:#3A3226;font-size:14px;line-height:1.6;">
        ${escapeHtml(message).replace(/\n/g, '<br>')}
      </div>
      <p style="margin:20px 0 0;font-size:12px;color:#9A8F7A;">Reponds directement a cet email pour repondre a ${escapeHtml(name)}.</p>
    `;

    try {
      await this.mailService.send({
        to: notifyTo as string,
        replyTo: `"${name}" <${email}>`,
        subject: `Nouveau message de contact - ${name}`,
        text: `De : ${name} (${email})\n\n${message}`,
        html: renderEmail(body),
      });
    } catch (err) {
      this.logger.error('Echec envoi email de contact', err as Error);
      throw new ServiceUnavailableException("L'envoi a echoue, reessaie plus tard.");
    }

    return { ok: true };
  }
}
