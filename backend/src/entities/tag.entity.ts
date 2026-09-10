import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HabitTag } from './habit-tag.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => HabitTag, (ht) => ht.tag)
  habitTags: HabitTag[];
}