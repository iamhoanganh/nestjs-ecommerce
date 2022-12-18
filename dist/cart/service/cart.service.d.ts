import { Repository } from 'typeorm';
import { CartEntity } from '../cart.entity';
import { ProductsService } from 'src/product/service/products.service';
export declare class CartService {
    private cartRepository;
    private productsService;
    constructor(cartRepository: Repository<CartEntity>, productsService: ProductsService);
    addToCart(productId: number, quantity: number, user: string): Promise<any>;
    getItemsInCard(user: string): Promise<CartEntity[]>;
}
