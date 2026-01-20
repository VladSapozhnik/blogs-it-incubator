import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetSecurityDeviceByUserIdQuery } from './application/queries/get-device-session-by-user-id.query';
import { RemoveOtherDeviceSessionCommand } from './application/usecase/remove-other-device-session.usecase';
import { RemoveDeviceSessionCommand } from './application/usecase/remove-device-session.usecase';
import { User } from '../auth/decorator/user.decorator';
import { type JwtPayload } from '../../../core/types/jwt-payload.type';
import { SecurityDeviceDocument } from './entities/security-device.entity';
import { RefreshAuthGuard } from '../auth/guards/refresh-token.guard';

@UseGuards(RefreshAuthGuard)
@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  getUserDevices(@User() user: JwtPayload) {
    return this.queryBus.execute<
      GetSecurityDeviceByUserIdQuery,
      SecurityDeviceDocument
    >(new GetSecurityDeviceByUserIdQuery(user.userId));
  }

  @Delete(':deviceId')
  removeDeviceSession(
    @User() user: JwtPayload,
    @Param('deviceId') deviceId: string,
  ) {
    return this.commandBus.execute<RemoveDeviceSessionCommand, void>(
      new RemoveDeviceSessionCommand(user, deviceId),
    );
  }

  @Delete()
  removeOtherSessions(@User() user: JwtPayload) {
    return this.commandBus.execute<RemoveOtherDeviceSessionCommand, void>(
      new RemoveOtherDeviceSessionCommand(user),
    );
  }
}
