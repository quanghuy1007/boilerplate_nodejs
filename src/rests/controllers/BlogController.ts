import { Body, JsonController, Post, UploadedFile, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';

import { AuthenticationMiddleware } from '@Middlewares/rest/AuthenticationMiddleware';

import { BlogService } from '@Services/BlogService';

import { FileInterface } from '@Rests/types/FileInterface';

@Service()
@JsonController('/blog')
@OpenAPI({ security: [{ BearerToken: [] }] })
@UseBefore(AuthenticationMiddleware)
export class BlogController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly blogService: BlogService,
  ) {}
  @Post('')
  @OpenAPI({
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: { type: 'string', format: 'binary' },
            },
          },
        },
      },
    },
  })
  async createBlog(@UploadedFile('file') file: FileInterface) {
    return this.blogService.createBlog('body.description', file.filename);
  }
}