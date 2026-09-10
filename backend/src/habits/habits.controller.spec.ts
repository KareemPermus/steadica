import { Test } from '@nestjs/testing';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

describe('HabitsController', () => {
  let controller: HabitsController;
  const mockService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Run', tags: [] }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Run', currentStreak: 3, longestStreak: 5, tags: [] }),
    create: jest.fn().mockResolvedValue({ id: 1, name: 'Run' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated' }),
    remove: jest.fn().mockResolvedValue({ message: 'Habit deleted' }),
    updateTags: jest.fn().mockResolvedValue([{ id: 1, name: 'morning' }]),
  };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [HabitsController],
      providers: [{ provide: HabitsService, useValue: mockService }],
    }).compile();
    controller = mod.get(HabitsController);
  });

  it('GET /habits returns array', async () => {
    const r = await controller.findAll();
    expect(r).toHaveLength(1);
    expect(r[0].name).toBe('Run');
  });

  it('GET /habits/:id returns habit with streaks', async () => {
    const r = await controller.findOne(1);
    expect(r.currentStreak).toBe(3);
  });

  it('POST /habits creates habit', async () => {
    const r = await controller.create({ name: 'Run', frequency: 'daily' });
    expect(r.id).toBe(1);
  });

  it('DELETE /habits/:id returns message', async () => {
    const r = await controller.remove(1);
    expect(r.message).toBe('Habit deleted');
  });

  it('PUT /habits/:id/tags returns tags', async () => {
    const r = await controller.updateTags(1, { tagIds: [1] });
    expect(r[0].name).toBe('morning');
  });
});