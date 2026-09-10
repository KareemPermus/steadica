import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto, UpdateReminderDto } from './dto';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly svc: RemindersService) {}

  @Get()
  findAll() { return this.svc.findAll(); }

  @Post()
  create(@Body() dto: CreateReminderDto) { return this.svc.create(dto); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReminderDto) { return this.svc.update(id, dto); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }
}