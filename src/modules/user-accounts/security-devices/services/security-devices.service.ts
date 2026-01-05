// import {
//   ForbiddenException,
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { CreateSecurityDeviceDto } from '../dto/create-security-device.dto';
// import { UpdateSecurityDeviceDto } from '../dto/update-security-device.dto';
// import { SecurityDeviceDocument } from '../entities/security-device.entity';
// import { SecurityDevicesRepository } from '../repositories/security-devices.repository';
// import { JwtPayload } from '../../../../core/types/jwt-payload.type';
//
// @Injectable()
// export class SecurityDevicesService {
//   constructor(
//     private readonly securityDevicesRepository: SecurityDevicesRepository,
//   ) {}
//
//   async removeDeviceSession(deviceId: string, refreshToken: string) {
//     let payload: JwtPayload;
//
//     try {
//       payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
//     } catch {
//       throw new UnauthorizedException('Unauthorized');
//     }
//
//     if (!payload || !payload.userId || !payload.deviceId || !payload.exp) {
//       throw new UnauthorizedException('Unauthorized');
//     }
//
//     const findDeviceId: SecurityDeviceDocument | null =
//       await this.securityDevicesRepository.findDeviceSessionByDeviceId(
//         deviceId,
//       );
//
//     if (!findDeviceId) {
//       throw new NotFoundException('Device session not found');
//     }
//
//     if (findDeviceId.userId.toString() !== payload.userId.toString()) {
//       throw new ForbiddenException('Forbidden');
//     }
//
//     await this.securityDevicesRepository.removeDeviceSession(
//       findDeviceId.userId.toString(),
//       deviceId,
//     );
//   }
//
//   async removeOtherDeviceSession(refreshToken: string) {
//     let payload: JwtPayload;
//
//     try {
//       payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
//     } catch {
//       throw new UnauthorizedException('Unauthorized');
//     }
//
//     if (!payload || !payload.userId || !payload.deviceId) {
//       throw new UnauthorizedException('Unauthorized');
//     }
//
//     await this.securityDevicesRepository.removeOtherDeviceSession(
//       payload.userId,
//       payload.deviceId,
//     );
//   }
// }
