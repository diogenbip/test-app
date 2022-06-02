import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query, Redirect, Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import { ConfirmDto } from './dto/confirm.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('/signup')
  @ApiCreatedResponse({
    description: 'Successful signup return user with code 201',
  })
  async signUp(@Body() signupCredentialsDto: SignupDto): Promise<User> {
    const user = await this.authService.signUp(signupCredentialsDto);
    await this.emailService.sendVerificationLink(user.email);
    return user;
  }

  @Post('/signin')
  @ApiCreatedResponse({
    status: 200,
    schema: {
      example: { accessToken: 'string', user: { id: 3, email: 'dan@mail.ru' } },
    },
    description: 'Successful signin return user and access token',
  })
  async signIn(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; user: JwtPayloadDto }> {
    return await this.authService.signIn(loginUserDto);
  }

  @Get('confirm')
  async confirm(@Res() res, @Query() confirmDto: ConfirmDto) {
    await this.emailService.confirmEmail(confirmDto.token);
    return res.redirect('http://localhost:3030/');
  }

  @Post('confirm/resend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async resendConfirm(@GetUser() user: User) {
    await this.emailService.resendConfirm(user.id);
  }
}
