import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly svc: TagsService) {}

  @Get()
  findAll() { return this.svc.findAll(); }

  @Post()
  create(@Body() dto: CreateTagDto) { return this.svc.create(dto); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }
}