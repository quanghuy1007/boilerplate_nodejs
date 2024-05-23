import { Service } from 'typedi';

import { Blog } from '@Entities/Blog';

import { BlogRepository } from '@Repositories/BlogRepository';

@Service()
export class BlogService {
  constructor(
    private readonly blogRepo: BlogRepository,
  ){}

  async createBlog(description: string, image: string) {
    const newBlog = new Blog();
    newBlog.description = description;
    newBlog.image = image;
    return this.blogRepo.create(newBlog);
  }
}