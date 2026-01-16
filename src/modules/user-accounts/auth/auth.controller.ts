import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CookieAdapter } from '../../../core/adapters/cookie.adapter';
import { type Response } from 'express';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { RegistrationConfirmationCodeDto } from './dto/registration-confirmation-code.dto';
import { RegistrationDto } from './dto/registration.dto';
import { RegistrationEmailResendingDto } from './dto/registration-email-resending.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersQueryExternalRepository } from '../users/repositories/users.query.external.repository';
import { ProfileMapper } from './mappers/profile.mapper';
import { User } from './decorator/user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationCommand } from './application/usecases/registration.usecase';
import { LoginCommand } from './application/usecases/login.usecase';
import { AccessAndRefreshTokensType } from './types/access-and-refresh-tokens.type';
import { ConfirmEmailCommand } from './application/usecases/confirm-email.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly authService: AuthService,
    private readonly cookieAdapter: CookieAdapter,
    private readonly userQueryExternalRepository: UsersQueryExternalRepository,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginCommand,
      AccessAndRefreshTokensType
    >(new LoginCommand(loginDto));

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
  async registrationConfirmation(@Body() dto: RegistrationConfirmationCodeDto) {
    await this.commandBus.execute<ConfirmEmailCommand, void>(
      new ConfirmEmailCommand(dto.code),
    );
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() registrationDto: RegistrationDto) {
    await this.commandBus.execute<RegistrationCommand, void>(
      new RegistrationCommand(registrationDto),
    );
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
  async profile(@User('userId') userId: string): Promise<ProfileMapper> {
    return this.userQueryExternalRepository.getProfile(userId);
  }
}
