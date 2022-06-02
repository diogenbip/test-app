import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadDto): Promise<User> {
    const { email } = payload;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('Please authorize', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
