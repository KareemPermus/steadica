import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkin } from '../entities/checkin.entity';
import { Habit } from '../entities/habit.entity';
import { CheckinsController } from './checkins.controller';
import { CheckinsService } from './checkins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Checkin, Habit])],
  controllers: [CheckinsController],
  providers: [CheckinsService],
})
export class CheckinsModule {}