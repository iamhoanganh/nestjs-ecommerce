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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const product_entity_1 = require("../product.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let ProductsService = class ProductsService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async getAll() {
        try {
            return await this.productRepository.find();
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async create(product, user) {
        if (user.role == 'admin') {
            return await this.productRepository.save(product);
        }
        throw new common_1.UnauthorizedException();
    }
    async getOne(id) {
        try {
            const product = await this.productRepository.findOne(id);
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${id} not found`);
            }
            return product;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async update(id, product, user) {
        try {
            if (user.role == 'admin') {
                const result = await this.productRepository.update(id, product);
                if (result.raw.affectedRows === 0) {
                    throw new common_1.NotFoundException(`Product with ID ${id} not found`);
                }
                return result;
            }
            throw new common_1.UnauthorizedException();
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async delete(id, user) {
        try {
            if (user.role == 'admin') {
                const result = await this.productRepository.delete(id);
                if (result.raw.affectedRows === 0) {
                    throw new common_1.NotFoundException(`Product with ID ${id} not found`);
                }
                return result;
            }
            throw new common_1.UnauthorizedException();
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
};
ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ProductsService);
exports.ProductsService = ProductsService;
//# sourceMappingURL=products.service.js.map