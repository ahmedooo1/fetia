import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { CardTemplate } from '../templates/template.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToOne(() => CardTemplate, { eager: true })
  template: CardTemplate;

  @Column('jsonb', { default: {} })
  data: Record<string, unknown>;

  @Column({ default: true })
  isUnlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
