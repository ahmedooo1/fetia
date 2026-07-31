import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardTemplate } from './template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(CardTemplate)
    private readonly templatesRepo: Repository<CardTemplate>,
  ) {}

  findAll(category?: string) {
    if (category) {
      return this.templatesRepo.find({ where: { category } });
    }
    return this.templatesRepo.find();
  }

  findOne(id: string) {
    return this.templatesRepo.findOne({ where: { id } });
  }
}
