import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export type TemplateCategory =
  | 'anniversaire'
  | 'fete'
  | 'invitation'
  | 'mariage'
  | 'naissance';

@Entity('card_templates')
export class CardTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  designKey: string;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ default: 0 })
  priceCents: number;

  @Column('jsonb', { default: {} })
  defaultData: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
