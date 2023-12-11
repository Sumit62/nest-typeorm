import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsString,
  IsInt,
  IsEmail,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsInt()
  @IsNotEmpty()
  phone: number;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsBoolean()
  isActive: boolean = true;
}
