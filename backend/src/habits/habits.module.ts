import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from '../entities/habit.entity';
import { HabitTag } from '../entities/habit-tag.entity';
import { Tag } from '../entities/tag.entity';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitTag, Tag])],
  controllers: [HabitsController],
  providers: [HabitsService],
  exports: [HabitsService],
})
export class HabitsModule {}