// hash-password.middleware.ts

import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.body.password) {
      if (typeof req.body.password !== 'string') {
        return res.status(401).json({ error: 'password should be string.' });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }
    next();
  }
}
@Injectable()
export class VerifyPasswordMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userDetails = await this.userRepository.findOneBy({
      email: req.body.email,
    });
    if (!userDetails) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User Not Found',
        data: {},
        status: false,
      });
    }
    if (req.body && req.body.password) {
      // Check if the provided password matches the expected hash
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        userDetails.password,
      );

      if (!isPasswordValid) {
        // Handle the case where the password is not valid
        return res.status(401).json({
          error: 'Invalid password',
          statusCode: HttpStatus.BAD_REQUEST,
          status: false,
          message: 'Incorrect password',
        });
      }
    }

    next();
  }
}
