import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Card } from './card.entity';

@Entity('rsvps')
export class Rsvp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Card, (card) => card.rsvps, { onDelete: 'CASCADE' })
  card: Card;

  @Column()
  name: string;

  @Column()
  attending: boolean;

  @Column({ default: 1 })
  guests: number;

  @Column({ nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
