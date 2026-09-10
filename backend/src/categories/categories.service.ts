import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  async findAll() {
    const cats = await this.repo.find({ relations: ['habits'] });
    return cats.map((c) => ({ id: c.id, name: c.name, color: c.color || '', habitCount: (c.habits || []).length }));
  }

  async create(dto: CreateCategoryDto) {
    const saved = await this.repo.save(this.repo.create(dto));
    return { id: saved.id, name: saved.name, color: saved.color || '' };
  }

  async update(id: number, dto: CreateCategoryDto) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Category not found');
    Object.assign(c, dto);
    const saved = await this.repo.save(c);
    return { id: saved.id, name: saved.name, color: saved.color || '' };
  }

  async remove(id: number) {
    const r = await this.repo.delete(id);
    if (r.affected === 0) throw new NotFoundException('Category not found');
    return { message: 'Category deleted' };
  }
}