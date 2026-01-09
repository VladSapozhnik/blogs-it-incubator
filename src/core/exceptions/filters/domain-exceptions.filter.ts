import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../domain-exceptions';

@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.status).json({
      errorsMessages: exception.errorsMessages,
    });
  }
}
