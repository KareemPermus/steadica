import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Tag } from '../entities/tag.entity';
import { Habit } from '../entities/habit.entity';
import { HabitTag } from '../entities/habit-tag.entity';
import { Checkin } from '../entities/checkin.entity';
import { Reminder } from '../entities/reminder.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Category) private catRepo: Repository<Category>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @InjectRepository(Habit) private habitRepo: Repository<Habit>,
    @InjectRepository(HabitTag) private htRepo: Repository<HabitTag>,
    @InjectRepository(Checkin) private checkinRepo: Repository<Checkin>,
    @InjectRepository(Reminder) private reminderRepo: Repository<Reminder>,
  ) {}

  async onModuleInit() {
    const count = await this.habitRepo.count();
    if (count > 0) return;
    this.logger.log('Seeding database...');

    const cats = await this.catRepo.save([
      { name: 'Health', color: '#E53E3E' },
      { name: 'Productivity', color: '#3182CE' },
      { name: 'Mindfulness', color: '#38A169' },
    ]);

    const tags = await this.tagRepo.save([
      { name: 'morning' }, { name: 'evening' }, { name: 'quick' }, { name: 'important' },
    ]);

    const habits = await this.habitRepo.save([
      { name: 'Morning Run', description: '30 min jog around the park', frequency: 'daily', color: '#E53E3E', categoryId: cats[0].id },
      { name: 'Read 20 Pages', description: 'Read non-fiction books', frequency: 'daily', color: '#3182CE', categoryId: cats[1].id },
      { name: 'Meditate', description: '10 min guided meditation', frequency: 'daily', color: '#38A169', categoryId: cats[2].id },
      { name: 'Drink 8 Glasses Water', description: 'Stay hydrated throughout the day', frequency: 'daily', color: '#DD6B20', categoryId: cats[0].id },
      { name: 'Weekly Review', description: 'Review goals and plan next week', frequency: 'weekly', color: '#805AD5', categoryId: cats[1].id },
    ]);

    await this.htRepo.save([
      { habitId: habits[0].id, tagId: tags[0].id },
      { habitId: habits[0].id, tagId: tags[3].id },
      { habitId: habits[1].id, tagId: tags[1].id },
      { habitId: habits[2].id, tagId: tags[0].id },
      { habitId: habits[2].id, tagId: tags[2].id },
    ]);

    // Seed checkins for last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      for (const h of habits.slice(0, 4)) {
        await this.checkinRepo.save({ habitId: h.id, date: dateStr, completed: Math.random() > 0.3, note: '' });
      }
    }

    await this.reminderRepo.save([
      { habitId: habits[0].id, time: '06:30', days: 'Mon,Tue,Wed,Thu,Fri', enabled: true },
      { habitId: habits[2].id, time: '07:00', days: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', enabled: true },
    ]);

    this.logger.log('Seeding complete');
  }
}