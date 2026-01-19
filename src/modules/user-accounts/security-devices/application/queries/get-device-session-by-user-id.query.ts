import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecurityDevicesQueryRepository } from '../../repositories/security-devices.query.repository';
import { type SecurityDeviceDocument } from '../../entities/security-device.entity';

export class GetSecurityDeviceByUserIdQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetSecurityDeviceByUserIdQuery)
export class GetDeviceSessionByUserIdQueryHandler implements IQueryHandler<GetSecurityDeviceByUserIdQuery> {
  constructor(
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async execute({
    userId,
  }: GetSecurityDeviceByUserIdQuery): Promise<SecurityDeviceDocument[]> {
    return this.securityDevicesQueryRepository.findDeviceSessionByUserId(
      userId,
    );
  }
}
