import { OrderEntity } from 'src/order/order.entity';
export declare class CartEntity {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    total: number;
    userId: string;
    items: OrderEntity;
}
