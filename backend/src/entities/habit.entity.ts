import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Category } from './category.entity';
import { Checkin } from './checkin.entity';
import { HabitTag } from './habit-tag.entity';
import { Reminder } from './reminder.entity';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  frequency: string;

  @Column({ length: 50, nullable: true })
  color: string;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (c) => c.habits, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Checkin, (c) => c.habit)
  checkins: Checkin[];

  @OneToMany(() => HabitTag, (ht) => ht.habit)
  habitTags: HabitTag[];

  @OneToMany(() => Reminder, (r) => r.habit)
  reminders: Reminder[];

  @CreateDateColumn()
  createdAt: Date;
}