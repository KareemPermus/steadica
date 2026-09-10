import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { CreateCheckinDto, UpdateCheckinDto } from './dto';

@Controller('checkins')
export class CheckinsController {
  constructor(private readonly svc: CheckinsService) {}

  @Get()
  findAll(@Query('date') date?: string, @Query('habitId') habitId?: string) {
    return this.svc.findAll({ date, habitId: habitId ? parseInt(habitId) : undefined });
  }

  @Post()
  create(@Body() dto: CreateCheckinDto) { return this.svc.create(dto); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCheckinDto) { return this.svc.update(id, dto); }
}