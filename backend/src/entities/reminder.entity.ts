import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Habit } from './habit.entity';

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  habitId: number;

  @ManyToOne(() => Habit, (h) => h.reminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habitId' })
  habit: Habit;

  @Column({ length: 10 })
  time: string;

  @Column({ length: 100 })
  days: string;

  @Column({ default: true })
  enabled: boolean;
}