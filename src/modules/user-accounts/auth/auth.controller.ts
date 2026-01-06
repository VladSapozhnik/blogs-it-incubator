import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CookieAdapter } from '../../../core/adapters/cookie.adapter';
import { type Response, type Request } from 'express';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { RegistrationConfirmationCodeDto } from './dto/registration-confirmation-code.dto';
import { RegistrationDto } from './dto/registration.dto';
import { RegistrationEmailResendingDto } from './dto/registration-email-resending.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieAdapter: CookieAdapter,
  ) {}

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    this.cookieAdapter.setRefreshCookie(res, refreshToken);

    return {
      accessToken,
    };
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    await this.authService.passwordRecovery(passwordRecoveryDto.email);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() newPasswordDto: NewPasswordDto) {
    await this.authService.newPassword(newPasswordDto);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() registrationConfirmationCodeDto: RegistrationConfirmationCodeDto,
  ) {
    await this.authService.confirmEmail(registrationConfirmationCodeDto.code);
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() registrationDto: RegistrationDto) {
    await this.authService.registration(registrationDto);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() registrationEmailResendingDto: RegistrationEmailResendingDto,
  ) {
    await this.authService.resendEmail(registrationEmailResendingDto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  profile(@Req() req: Request) {
    return req.user;
  }
}
