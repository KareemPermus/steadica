import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Habit } from './habit.entity';
import { Tag } from './tag.entity';

@Entity('habit_tags')
export class HabitTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  habitId: number;

  @Column()
  tagId: number;

  @ManyToOne(() => Habit, (h) => h.habitTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habitId' })
  habit: Habit;

  @ManyToOne(() => Tag, (t) => t.habitTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tagId' })
  tag: Tag;
}