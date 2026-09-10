import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({ controllers: [HealthController] }).compile();
    controller = mod.get(HealthController);
  });

  it('returns ok', () => {
    expect(controller.check()).toEqual({ status: 'ok' });
  });
});