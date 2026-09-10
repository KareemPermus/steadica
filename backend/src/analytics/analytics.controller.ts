import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Get('dashboard')
  dashboard() { return this.svc.dashboard(); }

  @Get('progress')
  progress() { return this.svc.progress(); }
}