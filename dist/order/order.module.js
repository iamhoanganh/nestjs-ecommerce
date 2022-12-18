"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const order_controller_1 = require("./controller/order.controller");
const order_service_1 = require("./service/order.service");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./order.entity");
const product_entity_1 = require("../product/product.entity");
const products_service_1 = require("../product/service/products.service");
const cart_service_1 = require("../cart/service/cart.service");
const cart_entity_1 = require("../cart/cart.entity");
let OrderModule = class OrderModule {
};
OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([order_entity_1.OrderEntity, product_entity_1.ProductEntity, cart_entity_1.CartEntity])],
        controllers: [order_controller_1.OrderController],
        providers: [order_service_1.OrderService, cart_service_1.CartService, products_service_1.ProductsService]
    })
], OrderModule);
exports.OrderModule = OrderModule;
//# sourceMappingURL=order.module.js.map