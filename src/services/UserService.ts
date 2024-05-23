import { Service } from 'typedi';
import { BadRequestError, UnauthorizedError } from 'routing-controllers';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';

import { env } from '@Libs/env';

import { User } from '@Entities/User';

import { UserRepository } from '@Repositories/UserRepository';

@Service()
export class UserService {
  constructor(
    @Logger(module) private logger: winston.Logger,
    private readonly userRepo: UserRepository,
  ){}

  async createUser(username: string, password: string) {
    const user = await this.userRepo.findOneUser(username, password);
    if (user) {
      throw new BadRequestError('Username or password already exists');
    }
    const newUser = new User();
    newUser.username = username;
    newUser.password = await hash(password, 10);
    return this.userRepo.create(newUser);
  }

  async login(username: string, password: string){
    const user = await this.userRepo.findOneUserByUsername(username);
    this.logger.info('abc::', user);
    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedError('Invalid username or password');
    }
    const token = sign({ userId: user.id, username: user.username }, env.jwt.publicKey, { expiresIn: '1h', algorithm: 'HS256' });
    delete user.password;
    return { user, token };
  }
}