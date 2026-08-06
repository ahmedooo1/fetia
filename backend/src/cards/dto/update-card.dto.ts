import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  rsvpEnabled?: boolean;
}
