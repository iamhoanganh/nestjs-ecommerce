import { UpdateResult, DeleteResult } from 'typeorm';
import { ProductsService } from '../service/products.service';
import { ProductEntity } from '../product.entity';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    GetAll(): Promise<ProductEntity[]>;
    Create(req: any, product: ProductEntity): Promise<ProductEntity>;
    GetOne(id: number): Promise<ProductEntity>;
    Update(id: number, product: ProductEntity, req: any): Promise<UpdateResult>;
    Delete(id: number, req: any): Promise<DeleteResult>;
}
