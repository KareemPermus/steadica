import { Test } from '@nestjs/testing';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';

describe('RemindersController', () => {
  let controller: RemindersController;
  const mockService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, habitId: 1, habitName: 'Run', time: '06:30', days: 'Mon,Tue', enabled: true }]),
    create: jest.fn().mockResolvedValue({ id: 1, habitId: 1, time: '06:30', days: 'Mon', enabled: true }),
    update: jest.fn().mockResolvedValue({ id: 1, habitId: 1, time: '07:00', days: 'Mon', enabled: false }),
    remove: jest.fn().mockResolvedValue({ message: 'Reminder deleted' }),
  };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [RemindersController],
      providers: [{ provide: RemindersService, useValue: mockService }],
    }).compile();
    controller = mod.get(RemindersController);
  });

  it('GET /reminders returns list with habitName', async () => {
    const r = await controller.findAll();
    expect(r[0].habitName).toBe('Run');
  });

  it('POST /reminders creates reminder', async () => {
    const r = await controller.create({ habitId: 1, time: '06:30', days: 'Mon' });
    expect(r.enabled).toBe(true);
  });

  it('DELETE /reminders/:id returns message', async () => {
    const r = await controller.remove(1);
    expect(r.message).toBe('Reminder deleted');
  });
});