import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Habit } from './habit.entity';

@Entity('checkins')
export class Checkin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  habitId: number;

  @ManyToOne(() => Habit, (h) => h.checkins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habitId' })
  habit: Habit;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'text', nullable: true })
  note: string;
}