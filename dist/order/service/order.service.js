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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const order_entity_1 = require("../order.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const cart_service_1 = require("../../cart/service/cart.service");
let OrderService = class OrderService {
    constructor(orderRepository, cartService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
    }
    async order(user) {
        try {
            const cartItems = await this.cartService.getItemsInCard(user);
            const userOrder = cartItems.filter((item) => item.userId === user);
            const subTotal = cartItems
                .map((item) => item.total)
                .reduce((acc, next) => acc + next);
            const order = { items: userOrder, subTotal: subTotal };
            return this.orderRepository.create(order);
        }
        catch (error) {
            console.error(error.message);
            throw new Error('There was an error placing your order. Please try again later.');
        }
    }
    async getOrders(user) {
        try {
            const orders = await this.orderRepository.find();
            return orders.filter((item) => item.items[0].userId === user);
        }
        catch (error) {
            console.error(error.message);
            throw new Error('There was an error retrieving your orders. Please try again later.');
        }
    }
};
OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(order_entity_1.OrderEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        cart_service_1.CartService])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map