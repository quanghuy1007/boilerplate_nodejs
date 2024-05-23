import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface, Middleware, UnauthorizedError } from 'routing-controllers';
import winston from 'winston';
import { Service } from 'typedi';
import { verify } from 'jsonwebtoken';

import { Logger } from '@Decorators/Logger';

import { env } from '@Libs/env';
import { WinstonLogger } from '@Libs/WinstonLogger';

const logger = WinstonLogger.create(module);

@Service()
@Middleware({ type: 'before' })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
  // constructor(@Logger(module) private logger: winston.Logger) {}

  public use(req: Request, res: Response, next: NextFunction): void {
    const [, token] = (req.headers.authorization || '').split(' ');
    if (!token) return next();
    console.log('a', token);
    try {
      const data: any = verify(token, env.jwt.publicKey, { algorithms: ['HS256'] });
      return next();
    } catch (error) {
      logger.error('AuthenticationMiddleware:: Lỗi khi xác thực token: ', error);
      throw new UnauthorizedError('Token không hợp lệ');
    }
  }
}
