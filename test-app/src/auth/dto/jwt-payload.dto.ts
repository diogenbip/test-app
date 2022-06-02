import { IsBoolean, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class JwtPayloadDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsBoolean()
  @IsNotEmpty()
  isConfirm: boolean;
}
