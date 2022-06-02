import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private mailerService: MailerService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public sendVerificationLink(email: string) {
    const token = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('JWT_VERIFICATION_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_VERIFICATION_TOKEN_EXPIRESIN',
        )}`,
      },
    );

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    return this.mailerService.sendMail({
      to: email,
      subject: 'Email confirmation',
      template: 'confirmMail.hbs',
      context: {
        url: url,
      },
    });
  }

  public async confirmEmail(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_SECRET'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        const user = await this.usersService.findByEmail(payload.email);
        if (user.isConfirm) {
          throw new BadRequestException('Email already confirmed');
        }
        return await this.usersService.markUserAsConfirmed(payload.email);
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendConfirm(userId: number) {
    const user = await this.usersService.findById(userId);
    if (user.isConfirm) {
      throw new BadRequestException('Already confirm');
    }
    await this.sendVerificationLink(user.email);
  }
}
