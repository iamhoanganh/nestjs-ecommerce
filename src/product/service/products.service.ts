import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductEntity } from '../product.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/auth/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async getAll(): Promise<ProductEntity[]> {
    try {
      return await this.productRepository.find();
    } catch (error) {
      // Handle the error here
      console.error(error);
      throw error;
    }
  }

  async create(product: ProductEntity, user: Users): Promise<ProductEntity> {
    if (user.role == 'admin') {
      return await this.productRepository.save(product);
    }
    throw new UnauthorizedException();
  }

  async getOne(id: number | string): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      // Handle the error here
      console.error(error);
      throw error;
    }
  }

  async update(
    id: number,
    product: ProductEntity,
    user: Users,
  ): Promise<UpdateResult> {
    try {
      if (user.role == 'admin') {
        const result = await this.productRepository.update(id, product);
        if (result.raw.affectedRows === 0) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return result;
      }
      throw new UnauthorizedException();
    } catch (error) {
      // Handle the error here
      console.error(error);
      throw error;
    }
  }

  async delete(id: number | string, user: Users): Promise<DeleteResult> {
    try {
      if (user.role == 'admin') {
        const result = await this.productRepository.delete(id);
        if (result.raw.affectedRows === 0) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return result;
      }
      throw new UnauthorizedException();
    } catch (error) {
      // Handle the error here
      console.error(error);
      throw error;
    }
  }
}
