import { Test } from '@nestjs/testing';
import { CheckinsController } from './checkins.controller';
import { CheckinsService } from './checkins.service';

describe('CheckinsController', () => {
  let controller: CheckinsController;
  const mockService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, habitId: 1, habitName: 'Run', date: '2024-01-01', completed: true, note: '' }]),
    create: jest.fn().mockResolvedValue({ id: 1, habitId: 1, date: '2024-01-01', completed: true, note: '' }),
    update: jest.fn().mockResolvedValue({ id: 1, habitId: 1, date: '2024-01-01', completed: false, note: 'skipped' }),
  };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [CheckinsController],
      providers: [{ provide: CheckinsService, useValue: mockService }],
    }).compile();
    controller = mod.get(CheckinsController);
  });

  it('GET /checkins returns list', async () => {
    const r = await controller.findAll();
    expect(r).toHaveLength(1);
    expect(r[0].habitName).toBe('Run');
  });

  it('POST /checkins creates checkin', async () => {
    const r = await controller.create({ habitId: 1, date: '2024-01-01', completed: true });
    expect(r.id).toBe(1);
  });

  it('PUT /checkins/:id updates', async () => {
    const r = await controller.update(1, { completed: false, note: 'skipped' });
    expect(r.completed).toBe(false);
  });
});