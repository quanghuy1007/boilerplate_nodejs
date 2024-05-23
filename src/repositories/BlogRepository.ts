import { Inject, Service } from 'typedi';
import { DataSource, DeepPartial, EntityRepository, Repository } from 'typeorm';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';

import { Blog } from '@Entities/Blog';

import { BaseOrmRepository } from '@Repositories/BaseOrmRepository';

@Service()
export class BlogRepository extends BaseOrmRepository<Blog> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Blog);
  }

  async create(blog: Blog) {
    return this.repo.save(blog);
  }
  async getAllBlog(){
    return this.repo.find();
  }
}
