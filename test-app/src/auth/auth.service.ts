import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignupDto): Promise<User> {
    return await this.usersService.signUp(signupDto);
  }

  async signIn(
    loginUserDto,
  ): Promise<{ accessToken: string; user: JwtPayloadDto }> {
    const resp = await this.usersService.validateUserPassword(loginUserDto);
    if (!resp) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload: JwtPayloadDto = resp;
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: resp,
    };
  }
}
