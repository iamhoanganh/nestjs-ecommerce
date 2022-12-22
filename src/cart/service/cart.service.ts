import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '../cart.entity';
import { ProductsService } from 'src/product/service/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    private productsService: ProductsService,
  ) {}
  async addToCart(
    productId: number,
    quantity: number,
    user: string,
  ): Promise<any> {
    try {
      // Validate input
      if (
        // typeof productId !== 'number' ||
        typeof quantity !== 'number' ||
        typeof user !== 'string' ||
        user.trim().length === 0
      ) {
        throw new Error(
          'Invalid input specified. Please ensure that you have specified valid values for the productId, quantity, and user arguments.',
        );
      }

      // Retrieve cart items
      const cartItems = await this.cartRepository.find();

      // Retrieve product
      const product = await this.productsService.getOne(productId);

      // Check if product exists
      if (!product) {
        throw new Error(
          'The specified product does not exist. Please ensure that you have specified a valid productId and try again.',
        );
      }

      // Check if item is already in the cart
      const cart = cartItems.filter(
        (item) => item.productId === productId && item.userId === user,
      );
      if (cart.length < 1) {
        // Item is not in the cart, create a new item
        const newItem = {
          productId: product.id,
          price: product.price,
          quantity,
          total: product.price * quantity,
          userId: user,
        };
        return await this.cartRepository.save(newItem);
      } else {
        // Item is already in the cart, update the quantity and total
        const updatedQuantity = (cart[0].quantity += 1);
        const updatedTotal = cart[0].price * updatedQuantity;

        return await this.cartRepository.update(cart[0].id, {
          quantity: updatedQuantity,
          total: updatedTotal,
        });
      }
    } catch (error) {
      // Log error
      console.error(error);

      // Throw a user-friendly error message
      throw new Error(
        'There was an error adding the item to the cart. Please ensure that you have specified valid input and try again later.',
      );
    }
  }

  async getItemsInCard(user: string): Promise<CartEntity[]> {
    try {
      // Validate input
      if (typeof user !== 'string' || user.trim().length === 0) {
        throw new Error(
          'Invalid user specified. Please ensure that you have specified a valid user and try again.',
        );
      }

      // Retrieve cart items from the database
      const userCart = await this.cartRepository.find();

      // Return items that belong to the specified user
      return userCart.filter((item) => item.userId === user);
    } catch (error) {
      // Log error
      console.error(error);

      // Throw a user-friendly error message
      throw new Error(
        'There was an error retrieving the items in your cart. Please ensure that you have specified a valid user and try again later.',
      );
    }
  }
}
