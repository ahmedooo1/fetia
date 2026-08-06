import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRsvpDto {
  @IsString()
  @MaxLength(80)
  name: string;

  @IsBoolean()
  attending: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  guests?: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  message?: string;
}
