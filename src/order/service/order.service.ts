import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../order.entity';
import { Repository, getManager, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartService } from 'src/cart/service/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private cartService: CartService,
  ) {}

  async order(user: string): Promise<OrderEntity> {
    try {
      const cartItems = await this.cartService.getItemsInCard(user);
      const userOrder = cartItems.filter((item) => item.userId === user);
      const subTotal = cartItems
        .map((item) => item.total)
        .reduce((acc, next) => acc + next);
      const order = { items: userOrder, subTotal: subTotal };
      return this.orderRepository.create(order);
    } catch (error) {
      console.error(error.message);
      throw new Error(
        'There was an error placing your order. Please try again later.',
      );
    }
  }

  async getOrders(user: string): Promise<OrderEntity[]> {
    try {
      const orders = await this.orderRepository.find();
      return orders.filter((item) => item.items[0].userId === user);
    } catch (error) {
      console.error(error.message);
      throw new Error(
        'There was an error retrieving your orders. Please try again later.',
      );
    }
  }
}
