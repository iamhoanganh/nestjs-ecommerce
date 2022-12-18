import { CartService } from '../service/cart.service';
import { CartEntity } from '../cart.entity';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    AddToCart(body: any, req: any): Promise<void>;
    getItemsInCart(req: any): Promise<CartEntity[]>;
}
