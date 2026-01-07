import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ValidationErrorResponse = {
  message: Array<{
    field: string;
    message: string;
  }>;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // if (exception instanceof BadRequestException) {
    if (
      typeof exceptionResponse === 'object' &&
      Array.isArray((exceptionResponse as ValidationErrorResponse).message) &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const errorsMessages = (exceptionResponse as ValidationErrorResponse)
        .message;

      return response.status(status).json({
        errorsMessages,
      });
    }

    if (exception instanceof UnauthorizedException) {
      return response.status(status).json({
        errorsMessages: [
          {
            message: 'Unauthorized',
            field: 'user',
          },
        ],
      });
    }
  }
}
