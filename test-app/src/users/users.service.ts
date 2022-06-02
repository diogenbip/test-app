import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from '../auth/dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import { randomBytes, scryptSync } from 'crypto';

import { LoginUserDto } from '../auth/dto/login-user.dto';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async signUp(signupCredentialsDto: SignupDto) {
    const { email, password } = signupCredentialsDto;

    const checkEmail = await this.userRepo.findOne({ email });

    if (checkEmail) {
      throw new BadRequestException('User with this email already exist');
    }

    const salt = randomBytes(16).toString('hex');

    const user = this.userRepo.create({
      email: email,
      password: await this.hashPassword(password, salt),
      salt: salt,
      isConfirm: false,
    });

    await this.userRepo.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ email });
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne(id);
    return user;
  }

  async markUserAsConfirmed(email: string) {
    const user = await this.userRepo.findOne({ email });
    user.isConfirm = true;
    await this.userRepo.save(user);
  }

  async validateUserPassword(
    loginUserDto: LoginUserDto,
  ): Promise<JwtPayloadDto> {
    const { email, password } = loginUserDto;
    const auth = await this.userRepo.findOne({ email: email });

    if (auth && (await auth.validatePassword(password))) {
      return {
        id: auth.id,
        email: auth.email,
        isConfirm: auth.isConfirm,
      };
    } else {
      throw new BadRequestException('User not found');
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return scryptSync(password, salt, 32).toString('hex');
  }
}
