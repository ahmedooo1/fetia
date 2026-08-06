import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface SendOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  isConfigured() {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  }

  private getTransporter() {
    if (this.transporter) return this.transporter;
    if (!this.isConfigured()) return null;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) !== 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    return this.transporter;
  }

  async send(options: SendOptions) {
    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.error('SMTP non configure : SMTP_HOST/SMTP_USER/SMTP_PASS manquants');
      throw new Error('mailer_not_configured');
    }
    await transporter.sendMail({
      from: `"Fetia" <${process.env.SMTP_USER}>`,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

// Gabarit d'email commun a toute l'app : mise en page par tableaux + styles
// inlines pour un rendu correct dans Gmail/Outlook/Apple Mail.
export function renderEmail(bodyHtml: string): string {
  const year = new Date().getFullYear();
  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:#F3EFE7;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3EFE7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #EAE3D6;">
            <tr>
              <td style="background-color:#FF6B8B;background:linear-gradient(135deg,#FF6B8B,#FFC857);padding:26px 32px;">
                <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B0E2E;letter-spacing:-0.02em;">
                  fetia<span style="color:#FFFFFF;">.</span>
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:${FONT_STACK};color:#3A3226;font-size:15px;line-height:1.65;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:#FAF7F1;border-top:1px solid #EAE3D6;font-family:${FONT_STACK};font-size:12px;color:#9A8F7A;">
                Fetia — Fait avec soin pour les moments qui comptent.<br />&copy; ${year} Fetia
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function emailButton(url: string, label: string): string {
  return `<div style="text-align:center;margin:28px 0;">
  <a href="${url}" style="display:inline-block;background-color:#FF6B8B;background:linear-gradient(135deg,#FF6B8B,#FFC857);color:#1B0E2E;font-weight:700;text-decoration:none;padding:14px 34px;border-radius:999px;font-family:${FONT_STACK};font-size:15px;">
    ${label}
  </a>
</div>`;
}
