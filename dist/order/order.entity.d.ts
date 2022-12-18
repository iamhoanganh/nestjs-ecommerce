import { CartEntity } from '../cart/cart.entity';
export declare class OrderEntity {
    id: number;
    items: CartEntity[];
    subTotal: number;
    payed: boolean;
}
