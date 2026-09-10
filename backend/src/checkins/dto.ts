import { IsInt, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCheckinDto {
  @IsInt()
  habitId: number;

  @IsString()
  date: string;

  @IsBoolean()
  completed: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateCheckinDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}