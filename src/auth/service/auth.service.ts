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
    const existingUser = await this.userRepository.findOne({
      where: [{ username: user.username }],
    });
    if (existingUser) {
      throw new HttpException(
        'An account with the same username or email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Validate email format
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(user.username)) {
      throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
    }
    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(user.password)) {
      throw new HttpException(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit',
        HttpStatus.BAD_REQUEST,
      );
    }

    // If the user does not already exist and the password is complex enough, hash the password and save the user
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return await this.userRepository.save(user);
  }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const foundUser = await this.userRepository.findOne({ username });
      if (foundUser) {
        if (await bcrypt.compare(password, foundUser.password)) {
          const { password, ...result } = foundUser;
          return result;
        } else {
          throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
        }
      }
      return null;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async login(user: any) {
    try {
      const payload = {
        username: user.username,
        sub: user.id,
        role: user.role,
      };

      return {
        access_token: this.jwt.sign(payload),
        role: user.role,
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new HttpException(
          'Error generating JWT',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
