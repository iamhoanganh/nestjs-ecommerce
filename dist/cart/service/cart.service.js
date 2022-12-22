"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const cart_entity_1 = require("../cart.entity");
const products_service_1 = require("../../product/service/products.service");
let CartService = class CartService {
    constructor(cartRepository, productsService) {
        this.cartRepository = cartRepository;
        this.productsService = productsService;
    }
    async addToCart(productId, quantity, user) {
        try {
            if (typeof quantity !== 'number' ||
                typeof user !== 'string' ||
                user.trim().length === 0) {
                throw new Error('Invalid input specified. Please ensure that you have specified valid values for the productId, quantity, and user arguments.');
            }
            const cartItems = await this.cartRepository.find();
            const product = await this.productsService.getOne(productId);
            if (!product) {
                throw new Error('The specified product does not exist. Please ensure that you have specified a valid productId and try again.');
            }
            const cart = cartItems.filter((item) => item.productId === productId && item.userId === user);
            if (cart.length < 1) {
                const newItem = {
                    productId: product.id,
                    price: product.price,
                    quantity,
                    total: product.price * quantity,
                    userId: user,
                };
                return await this.cartRepository.save(newItem);
            }
            else {
                const updatedQuantity = (cart[0].quantity += 1);
                const updatedTotal = cart[0].price * updatedQuantity;
                return await this.cartRepository.update(cart[0].id, {
                    quantity: updatedQuantity,
                    total: updatedTotal,
                });
            }
        }
        catch (error) {
            console.error(error);
            throw new Error('There was an error adding the item to the cart. Please ensure that you have specified valid input and try again later.');
        }
    }
    async getItemsInCard(user) {
        try {
            if (typeof user !== 'string' || user.trim().length === 0) {
                throw new Error('Invalid user specified. Please ensure that you have specified a valid user and try again.');
            }
            const userCart = await this.cartRepository.find();
            return userCart.filter((item) => item.userId === user);
        }
        catch (error) {
            console.error(error);
            throw new Error('There was an error retrieving the items in your cart. Please ensure that you have specified a valid user and try again later.');
        }
    }
};
CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(cart_entity_1.CartEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        products_service_1.ProductsService])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map