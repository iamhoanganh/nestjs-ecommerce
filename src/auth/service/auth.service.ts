import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private jwt: JwtService,
  ) {}
  async signup(user: Users): Promise<Users> {
    // Check if an account with the same username or email already exists
    try {
      await this.userRepository.findOneOrFail({
        where: [{ username: user.username }, { username: user.username }],
      });
      throw new HttpException(
        'An account with the same username or user already exists',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      if (error.name === 'EntityNotFound') {
        // If the user does not already exist, hash the password and save the user
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        return await this.userRepository.save(user);
      } else {
        throw error;
      }
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const foundUser = await this.userRepository.findOne({ username });
    if (foundUser) {
      if (await bcrypt.compare(password, foundUser.password)) {
        const { password, ...result } = foundUser;
        return result;
      }

      return null;
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };

    return {
      access_token: this.jwt.sign(payload),
    };
  }
}
