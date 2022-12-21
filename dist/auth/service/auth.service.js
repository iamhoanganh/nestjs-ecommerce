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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user.entity");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userRepository, jwt) {
        this.userRepository = userRepository;
        this.jwt = jwt;
    }
    async signup(user) {
        const existingUser = await this.userRepository.findOne({
            where: [{ username: user.username }],
        });
        if (existingUser) {
            throw new common_1.HttpException('An account with the same username or email already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(user.password)) {
            throw new common_1.HttpException('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit', common_1.HttpStatus.BAD_REQUEST);
        }
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        return await this.userRepository.save(user);
    }
    async validateUser(username, password) {
        try {
            const foundUser = await this.userRepository.findOne({ username });
            if (foundUser) {
                if (await bcrypt.compare(password, foundUser.password)) {
                    const { password } = foundUser, result = __rest(foundUser, ["password"]);
                    return result;
                }
                else {
                    throw new common_1.HttpException('Invalid password', common_1.HttpStatus.UNAUTHORIZED);
                }
            }
            return null;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async login(user) {
        try {
            const payload = {
                username: user.username,
                sub: user.id,
                role: user.role,
            };
            return {
                access_token: this.jwt.sign(payload),
            };
        }
        catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw new common_1.HttpException('Error generating JWT', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            else {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map