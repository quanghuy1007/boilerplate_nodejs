import { JsonController, Post, Body, BadRequestError, UnauthorizedError, Get, CurrentUser, Authorized } from 'routing-controllers';
import { sign, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import winston from 'winston';
import { Service } from 'typedi';

import { Logger } from '@Decorators/Logger';

import { User } from '@Entities/User';

import { UserService } from '@Services/UserService';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(
        @Logger(module) private readonly logger: winston.Logger,
        private readonly userService: UserService,
  ) {}

  @Post('/register')
  async register(@Body() body: { username: string, password: string }) {
    return this.userService.createUser(body.username, body.password);
  }

  @Post('/login')
  async login(@Body() body: { username: string, password: string }) {
    return this.userService.login(body.username, body.password);
  }

  @Authorized()
  @Get('/logout')
  async logout(@CurrentUser() user: User) {
    // You may want to perform additional logout logic here
    return { message: 'Logout successful' };
  }
}
