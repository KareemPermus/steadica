import { Test } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  const mockService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Health', color: '#E53E3E', habitCount: 2 }]),
    create: jest.fn().mockResolvedValue({ id: 1, name: 'Health', color: '#E53E3E' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Wellness', color: '#38A169' }),
    remove: jest.fn().mockResolvedValue({ message: 'Category deleted' }),
  };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: mockService }],
    }).compile();
    controller = mod.get(CategoriesController);
  });

  it('GET /categories returns list with habitCount', async () => {
    const r = await controller.findAll();
    expect(r[0].habitCount).toBe(2);
  });

  it('DELETE /categories/:id returns message', async () => {
    const r = await controller.remove(1);
    expect(r.message).toBe('Category deleted');
  });
});