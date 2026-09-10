import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from '../entities/habit.entity';
import { HabitTag } from '../entities/habit-tag.entity';
import { Tag } from '../entities/tag.entity';
import { Checkin } from '../entities/checkin.entity';
import { CreateHabitDto, UpdateHabitDto } from './dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit) private habitRepo: Repository<Habit>,
    @InjectRepository(HabitTag) private habitTagRepo: Repository<HabitTag>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
  ) {}

  async findAll() {
    const habits = await this.habitRepo.find({ relations: ['habitTags', 'habitTags.tag'], order: { id: 'DESC' } });
    return habits.map((h) => ({
      id: h.id,
      name: h.name,
      description: h.description || '',
      frequency: h.frequency,
      color: h.color || '',
      categoryId: h.categoryId,
      createdAt: h.createdAt,
      tags: (h.habitTags || []).map((ht) => ({ id: ht.tag.id, name: ht.tag.name })),
    }));
  }

  async findOne(id: number) {
    const h = await this.habitRepo.findOne({ where: { id }, relations: ['habitTags', 'habitTags.tag', 'checkins'] });
    if (!h) throw new NotFoundException('Habit not found');
    const { currentStreak, longestStreak } = this.calcStreaks(h.checkins || []);
    return {
      id: h.id,
      name: h.name,
      description: h.description || '',
      frequency: h.frequency,
      color: h.color || '',
      categoryId: h.categoryId,
      createdAt: h.createdAt,
      currentStreak,
      longestStreak,
      tags: (h.habitTags || []).map((ht) => ({ id: ht.tag.id, name: ht.tag.name })),
    };
  }

  private calcStreaks(checkins: Checkin[]) {
    const completed = checkins
      .filter((c) => c.completed)
      .map((c) => c.date)
      .sort()
      .reverse();
    if (!completed.length) return { currentStreak: 0, longestStreak: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 1;
    const today = new Date().toISOString().slice(0, 10);

    // current streak from today backwards
    if (completed[0] === today || completed[0] === this.yesterday(today)) {
      currentStreak = 1;
      for (let i = 1; i < completed.length; i++) {
        if (completed[i] === this.yesterday(completed[i - 1])) currentStreak++;
        else break;
      }
    }

    // longest streak
    for (let i = 1; i < completed.length; i++) {
      if (completed[i] === this.yesterday(completed[i - 1])) streak++;
      else { longestStreak = Math.max(longestStreak, streak); streak = 1; }
    }
    longestStreak = Math.max(longestStreak, streak, currentStreak);
    return { currentStreak, longestStreak };
  }

  private yesterday(dateStr: string) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }

  async create(dto: CreateHabitDto) {
    const habit = this.habitRepo.create(dto);
    const saved = await this.habitRepo.save(habit);
    return {
      id: saved.id,
      name: saved.name,
      description: saved.description || '',
      frequency: saved.frequency,
      color: saved.color || '',
      categoryId: saved.categoryId,
      createdAt: saved.createdAt,
    };
  }

  async update(id: number, dto: UpdateHabitDto) {
    const habit = await this.habitRepo.findOne({ where: { id } });
    if (!habit) throw new NotFoundException('Habit not found');
    Object.assign(habit, dto);
    const saved = await this.habitRepo.save(habit);
    return {
      id: saved.id,
      name: saved.name,
      description: saved.description || '',
      frequency: saved.frequency,
      color: saved.color || '',
      categoryId: saved.categoryId,
      createdAt: saved.createdAt,
    };
  }

  async remove(id: number) {
    const r = await this.habitRepo.delete(id);
    if (r.affected === 0) throw new NotFoundException('Habit not found');
    return { message: 'Habit deleted' };
  }

  async updateTags(id: number, tagIds: number[]) {
    const habit = await this.habitRepo.findOne({ where: { id } });
    if (!habit) throw new NotFoundException('Habit not found');
    await this.habitTagRepo.delete({ habitId: id });
    for (const tagId of tagIds) {
      await this.habitTagRepo.save({ habitId: id, tagId });
    }
    const tags = await this.tagRepo.findByIds(tagIds);
    return tags.map((t) => ({ id: t.id, name: t.name }));
  }
}