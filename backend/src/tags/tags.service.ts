import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private repo: Repository<Tag>) {}

  findAll() { return this.repo.find(); }

  async create(dto: CreateTagDto) {
    const saved = await this.repo.save(this.repo.create(dto));
    return { id: saved.id, name: saved.name };
  }

  async remove(id: number) {
    const r = await this.repo.delete(id);
    if (r.affected === 0) throw new NotFoundException('Tag not found');
    return { message: 'Tag deleted' };
  }
}