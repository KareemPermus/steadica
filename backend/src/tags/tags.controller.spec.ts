import { Test } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

describe('TagsController', () => {
  let controller: TagsController;
  const mockService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'morning' }]),
    create: jest.fn().mockResolvedValue({ id: 1, name: 'morning' }),
    remove: jest.fn().mockResolvedValue({ message: 'Tag deleted' }),
  };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [{ provide: TagsService, useValue: mockService }],
    }).compile();
    controller = mod.get(TagsController);
  });

  it('GET /tags returns list', async () => {
    const r = await controller.findAll();
    expect(r[0].name).toBe('morning');
  });

  it('POST /tags creates tag', async () => {
    const r = await controller.create({ name: 'morning' });
    expect(r.id).toBe(1);
  });

  it('DELETE /tags/:id returns message', async () => {
    const r = await controller.remove(1);
    expect(r.message).toBe('Tag deleted');
  });
});