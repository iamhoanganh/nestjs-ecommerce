import { ProductEntity } from '../product.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Users } from 'src/auth/user.entity';
export declare class ProductsService {
    private productRepository;
    constructor(productRepository: Repository<ProductEntity>);
    getAll(): Promise<ProductEntity[]>;
    create(product: ProductEntity, user: Users): Promise<ProductEntity>;
    getOne(id: number | string): Promise<ProductEntity>;
    update(id: number, product: ProductEntity, user: Users): Promise<UpdateResult>;
    delete(id: number | string, user: Users): Promise<DeleteResult>;
}
