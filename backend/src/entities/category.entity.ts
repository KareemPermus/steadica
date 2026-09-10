import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Habit } from './habit.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50, nullable: true })
  color: string;

  @OneToMany(() => Habit, (h) => h.category)
  habits: Habit[];
}