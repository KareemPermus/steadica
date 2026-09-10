import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from '../entities/habit.entity';
import { Checkin } from '../entities/checkin.entity';
import { Category } from '../entities/category.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Habit) private habitRepo: Repository<Habit>,
    @InjectRepository(Checkin) private checkinRepo: Repository<Checkin>,
    @InjectRepository(Category) private catRepo: Repository<Category>,
  ) {}

  async dashboard() {
    const today = new Date().toISOString().slice(0, 10);
    const habits = await this.habitRepo.find({ relations: ['checkins'] });
    const totalHabits = habits.length;
    const todayCheckins = habits.map((h) => (h.checkins || []).find((c) => c.date === today && c.completed));
    const todayCompleted = todayCheckins.filter(Boolean).length;
    const todayTotal = totalHabits;

    const allCheckins = await this.checkinRepo.find();
    const totalCheckins = allCheckins.length;
    const completedCheckins = allCheckins.filter((c) => c.completed).length;
    const overallCompletionRate = totalCheckins > 0 ? Math.round((completedCheckins / totalCheckins) * 100) / 100 : 0;

    const topStreaks = habits.map((h) => {
      const streak = this.calcCurrentStreak(h.checkins || []);
      return { habitId: h.id, habitName: h.name, currentStreak: streak };
    }).sort((a, b) => b.currentStreak - a.currentStreak).slice(0, 5);

    return { totalHabits, todayCompleted, todayTotal, overallCompletionRate, topStreaks };
  }

  async progress() {
    const habits = await this.habitRepo.find({ relations: ['checkins', 'category'] });
    const allCheckins = await this.checkinRepo.find();

    // by habit
    const byHabit = habits.map((h) => {
      const total = (h.checkins || []).length;
      const completed = (h.checkins || []).filter((c) => c.completed).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) / 100 : 0;
      const { current, longest } = this.calcStreaks(h.checkins || []);
      return { habitId: h.id, habitName: h.name, completionRate, currentStreak: current, longestStreak: longest };
    });

    // by category
    const cats = await this.catRepo.find({ relations: ['habits', 'habits.checkins'] });
    const byCategory = cats.map((cat) => {
      const catCheckins = (cat.habits || []).flatMap((h) => h.checkins || []);
      const total = catCheckins.length;
      const completed = catCheckins.filter((c) => c.completed).length;
      return { categoryId: cat.id, categoryName: cat.name, completionRate: total > 0 ? Math.round((completed / total) * 100) / 100 : 0 };
    });

    // daily (last 30 days)
    const daily: { date: string; completionRate: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayCheckins = allCheckins.filter((c) => c.date === dateStr);
      const total = dayCheckins.length;
      const completed = dayCheckins.filter((c) => c.completed).length;
      daily.push({ date: dateStr, completionRate: total > 0 ? Math.round((completed / total) * 100) / 100 : 0 });
    }

    return { byHabit, byCategory, daily };
  }

  private calcCurrentStreak(checkins: Checkin[]) {
    const dates = checkins.filter((c) => c.completed).map((c) => c.date).sort().reverse();
    if (!dates.length) return 0;
    const today = new Date().toISOString().slice(0, 10);
    if (dates[0] !== today && dates[0] !== this.yesterday(today)) return 0;
    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] === this.yesterday(dates[i - 1])) streak++;
      else break;
    }
    return streak;
  }

  private calcStreaks(checkins: Checkin[]) {
    const dates = checkins.filter((c) => c.completed).map((c) => c.date).sort().reverse();
    if (!dates.length) return { current: 0, longest: 0 };
    const today = new Date().toISOString().slice(0, 10);
    let current = 0;
    if (dates[0] === today || dates[0] === this.yesterday(today)) {
      current = 1;
      for (let i = 1; i < dates.length; i++) {
        if (dates[i] === this.yesterday(dates[i - 1])) current++;
        else break;
      }
    }
    let longest = 1, streak = 1;
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] === this.yesterday(dates[i - 1])) streak++;
      else { longest = Math.max(longest, streak); streak = 1; }
    }
    longest = Math.max(longest, streak, current);
    return { current, longest };
  }

  private yesterday(dateStr: string) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }
}