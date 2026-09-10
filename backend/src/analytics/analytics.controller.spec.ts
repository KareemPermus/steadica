import { Test } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  const mockService = {
    dashboard: jest.fn().mockResolvedValue({ totalHabits: 5, todayCompleted: 3, todayTotal: 5, overallCompletionRate: 0.7, topStreaks: [] }),
    progress: jest.fn().mockResolvedValue({ byHabit: [], byCategory: [], daily: [] }),
  };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [{ provide: AnalyticsService, useValue: mockService }],
    }).compile();
    controller = mod.get(AnalyticsController);
  });

  it('GET /analytics/dashboard returns stats', async () => {
    const r = await controller.dashboard();
    expect(r.totalHabits).toBe(5);
    expect(r.overallCompletionRate).toBe(0.7);
  });

  it('GET /analytics/progress returns progress data', async () => {
    const r = await controller.progress();
    expect(r).toHaveProperty('byHabit');
    expect(r).toHaveProperty('daily');
  });
});