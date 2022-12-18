import { OrderEntity } from '../order.entity';
import { Repository } from 'typeorm';
import { CartService } from 'src/cart/service/cart.service';
export declare class OrderService {
    private orderRepository;
    private cartService;
    constructor(orderRepository: Repository<OrderEntity>, cartService: CartService);
    order(user: string): Promise<OrderEntity>;
    getOrders(user: string): Promise<OrderEntity[]>;
}
