import { IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @IsEmail()
  @MaxLength(160)
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  message: string;

  // honeypot : ce champ doit rester vide, seuls les bots le remplissent
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;

  // timestamp (ms) auquel le formulaire a ete affiche cote client
  @IsOptional()
  @IsInt()
  startedAt?: number;
}
