import {
  IsString,
  IsInt,
  IsEmail,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
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

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
