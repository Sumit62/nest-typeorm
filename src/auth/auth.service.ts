import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async authentication(uuid: string): Promise<string> {
    try {
      return await this.jwtService.signAsync({ id: uuid });
    } catch (error) {
      return error;
    }
  }
}
