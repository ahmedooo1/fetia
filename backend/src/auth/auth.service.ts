import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService, emailButton, escapeHtml, renderEmail } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private sign(userId: string) {
    return this.jwtService.sign({ sub: userId });
  }

  private toPublic(user: { id: string; email: string; name: string }) {
    return { id: user.id, email: user.email, name: user.name };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Un compte existe deja avec cet email');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });
    return { accessToken: this.sign(user.id), user: this.toPublic(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');
    return { accessToken: this.sign(user.id), user: this.toPublic(user) };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    // reponse identique que l'email existe ou non, pour ne pas reveler les comptes existants
    if (!user) return { ok: true };

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await this.usersService.save(user);

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${rawToken}`;

    if (this.mailService.isConfigured()) {
      const body = `
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#C98A4B;">Fetia</p>
        <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B0E2E;">Reinitialise ton mot de passe</h1>
        <p style="margin:0 0 4px;color:#3A3226;">On a recu une demande de reinitialisation pour ton compte Fetia.</p>
        <p style="margin:0;color:#3A3226;">Ce lien est valable 1 heure.</p>
        ${emailButton(escapeHtml(resetUrl), 'Choisir un nouveau mot de passe')}
        <p style="margin:0;font-size:12px;color:#9A8F7A;">Si tu n'es pas a l'origine de cette demande, ignore simplement ce message : ton mot de passe restera inchange.</p>
        <p style="margin:16px 0 0;font-size:12px;color:#9A8F7A;word-break:break-all;">Le bouton ne fonctionne pas ? Copie ce lien : ${escapeHtml(resetUrl)}</p>
      `;
      await this.mailService
        .send({
          to: user.email,
          subject: 'Reinitialise ton mot de passe Fetia',
          text: `Clique sur ce lien pour choisir un nouveau mot de passe (valable 1h) :\n${resetUrl}\n\nSi tu n'es pas a l'origine de cette demande, ignore ce message.`,
          html: renderEmail(body),
        })
        .catch(() => undefined); // best-effort, ne pas reveler d'echec au client
    }

    return { ok: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');
    const user = await this.usersService.findByValidResetToken(tokenHash);
    if (!user) {
      throw new UnauthorizedException('Ce lien de reinitialisation est invalide ou a expire');
    }
    user.passwordHash = await bcrypt.hash(dto.password, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await this.usersService.save(user);
    return { ok: true };
  }
}
