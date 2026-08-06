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

  findByValidResetToken(tokenHash: string) {
    return this.usersRepo.findOne({
      where: { resetPasswordTokenHash: tokenHash, resetPasswordExpires: MoreThan(new Date()) },
    });
  }

  async create(data: { email: string; passwordHash: string; name?: string }) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  save(user: User) {
    return this.usersRepo.save(user);
  }
}
