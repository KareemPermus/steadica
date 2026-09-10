import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../entities/reminder.entity';
import { CreateReminderDto, UpdateReminderDto } from './dto';

@Injectable()
export class RemindersService {
  constructor(@InjectRepository(Reminder) private repo: Repository<Reminder>) {}

  async findAll() {
    const list = await this.repo.find({ relations: ['habit'] });
    return list.map((r) => ({
      id: r.id, habitId: r.habitId, habitName: r.habit?.name || '', time: r.time, days: r.days, enabled: r.enabled,
    }));
  }

  async create(dto: CreateReminderDto) {
    const saved = await this.repo.save(this.repo.create({ ...dto, enabled: dto.enabled ?? true }));
    return { id: saved.id, habitId: saved.habitId, time: saved.time, days: saved.days, enabled: saved.enabled };
  }

  async update(id: number, dto: UpdateReminderDto) {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Reminder not found');
    Object.assign(r, dto);
    const saved = await this.repo.save(r);
    return { id: saved.id, habitId: saved.habitId, time: saved.time, days: saved.days, enabled: saved.enabled };
  }

  async remove(id: number) {
    const r = await this.repo.delete(id);
    if (r.affected === 0) throw new NotFoundException('Reminder not found');
    return { message: 'Reminder deleted' };
  }
}