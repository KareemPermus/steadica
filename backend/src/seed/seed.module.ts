import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Tag } from '../entities/tag.entity';
import { Habit } from '../entities/habit.entity';
import { HabitTag } from '../entities/habit-tag.entity';
import { Checkin } from '../entities/checkin.entity';
import { Reminder } from '../entities/reminder.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Tag, Habit, HabitTag, Checkin, Reminder])],
  providers: [SeedService],
})
export class SeedModule {}