import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
