import { OrderService } from '../service/order.service';
import { OrderEntity } from '../order.entity';
export declare class OrderController {
    private orderService;
    constructor(orderService: OrderService);
    order(req: any): Promise<OrderEntity>;
    getOrders(req: any): Promise<OrderEntity[]>;
}
