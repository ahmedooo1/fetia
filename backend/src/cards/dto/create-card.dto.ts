import { IsObject, IsUUID } from 'class-validator';

export class CreateCardDto {
  @IsUUID()
  templateId: string;

  @IsObject()
  data: Record<string, unknown>;
}
