import { IsInt, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateReminderDto {
  @IsInt()
  habitId: number;

  @IsString()
  time: string;

  @IsString()
  days: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateReminderDto {
  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  days?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}