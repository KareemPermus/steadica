import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  frequency: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}

export class UpdateHabitTagsDto {
  @IsInt({ each: true })
  tagIds: number[];
}