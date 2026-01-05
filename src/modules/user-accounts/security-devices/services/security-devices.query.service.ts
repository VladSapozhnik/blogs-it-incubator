// import { SecurityDevicesQueryRepository } from '../repositories/security-devices.query.repository';
// import { SecurityDeviceDocument } from '../entities/security-device.entity';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
//
// @Injectable()
// export class SecurityDevicesQueryService {
//   constructor(
//     private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
//   ) {}
//
//   async getSessionByUser(refreshToken: string) {
//     let payload: JwtPayload;
//
//     try {
//       payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
//     } catch {
//       throw new UnauthorizedException('Unauthorized');
//     }
//
//     if (!payload || !payload.userId) {
//       throw new UnauthorizedException('Unauthorized');
//     }
//
//     const sessions: SecurityDeviceDocument[] | null =
//       await this.securityDevicesQueryRepository.findDeviceSessionByUserId(
//         payload.userId,
//       );
//
//     if (!sessions) {
//       throw new UnauthorizedException('Unauthorized');
//     }
//
//     return sessions.map(securityDevicesMapper);
//   }
// }
