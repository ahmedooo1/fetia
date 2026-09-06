import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  findByGoogleId(googleId: string) {
    return this.usersRepo.findOne({ where: { googleId } });
  }

  findByValidResetToken(tokenHash: string) {
    return this.usersRepo.findOne({
      where: { resetPasswordTokenHash: tokenHash, resetPasswordExpires: MoreThan(new Date()) },
    });
  }

  async create(data: {
    email: string;
    passwordHash?: string;
    name?: string;
    googleId?: string;
    emailVerified?: boolean;
  }) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async linkGoogleId(id: string, googleId: string) {
    const user = await this.findById(id);
    if (!user) return null;
    user.googleId = googleId;
    user.emailVerified = true;
    return this.usersRepo.save(user);
  }

  async setEmailVerified(id: string) {
    await this.usersRepo.update(id, { emailVerified: true });
    return this.findById(id);
  }

  save(user: User) {
    return this.usersRepo.save(user);
  }
}
