import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto, UpdateHabitDto, UpdateHabitTagsDto } from './dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly svc: HabitsService) {}

  @Get()
  findAll() { return this.svc.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

  @Post()
  create(@Body() dto: CreateHabitDto) { return this.svc.create(dto); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHabitDto) { return this.svc.update(id, dto); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }

  @Put(':id/tags')
  updateTags(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHabitTagsDto) {
    return this.svc.updateTags(id, dto.tagIds);
  }
}