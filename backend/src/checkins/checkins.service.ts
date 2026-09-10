import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkin } from '../entities/checkin.entity';
import { CreateCheckinDto, UpdateCheckinDto } from './dto';

@Injectable()
export class CheckinsService {
  constructor(@InjectRepository(Checkin) private repo: Repository<Checkin>) {}

  async findAll(query: { date?: string; habitId?: number }) {
    const qb = this.repo.createQueryBuilder('c').leftJoinAndSelect('c.habit', 'h');
    if (query.date) qb.andWhere('c.date = :date', { date: query.date });
    if (query.habitId) qb.andWhere('c.habitId = :habitId', { habitId: query.habitId });
    const list = await qb.orderBy('c.date', 'DESC').getMany();
    return list.map((c) => ({
      id: c.id,
      habitId: c.habitId,
      habitName: c.habit?.name || '',
      date: c.date,
      completed: c.completed,
      note: c.note || '',
    }));
  }

  async create(dto: CreateCheckinDto) {
    const saved = await this.repo.save(this.repo.create(dto));
    return { id: saved.id, habitId: saved.habitId, date: saved.date, completed: saved.completed, note: saved.note || '' };
  }

  async update(id: number, dto: UpdateCheckinDto) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Checkin not found');
    Object.assign(c, dto);
    const saved = await this.repo.save(c);
    return { id: saved.id, habitId: saved.habitId, date: saved.date, completed: saved.completed, note: saved.note || '' };
  }
}