import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Ocurrió un error interno en el servidor';
        let details: any = null;

        if (exception instanceof HttpException) {
        const res = exception.getResponse();
        status = exception.getStatus();

        if (typeof res === 'string') {
            message = res;
        } else if (typeof res === 'object' && res !== null) {
            message = (res as any).message || message;
            details = (res as any).errors || null;
        }
        } else if (exception instanceof Error) {
        // Errores inesperados de JS (MySQL, etc.)
        message = exception.message;
        }

        // Formato de salida uniforme
        response.status(status).json({
        statusCode: status,
        message,
        ...(details ? { errors: details } : {}),
        timestamp: new Date().toISOString(),
        path: request.url,
        });
    }
}
