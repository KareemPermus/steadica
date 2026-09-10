import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { Checkin } from './entities/checkin.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { HabitTag } from './entities/habit-tag.entity';
import { Reminder } from './entities/reminder.entity';
import { HabitsModule } from './habits/habits.module';
import { CheckinsModule } from './checkins/checkins.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { RemindersModule } from './reminders/reminders.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'mysql-shared',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'root',
      database: process.env.MYSQL_DB || 'steadica_f79666dc',
      entities: [Habit, Checkin, Category, Tag, HabitTag, Reminder],
      synchronize: true,
      ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    HabitsModule,
    CheckinsModule,
    CategoriesModule,
    TagsModule,
    RemindersModule,
    AnalyticsModule,
    HealthModule,
    SeedModule,
  ],
})
export class AppModule {}