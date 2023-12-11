import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { classToPlain } from 'class-transformer';
import { getOrder, getWhere } from 'src/helpers';
import { Sorting } from 'src/helpers/decorator/shorting.decorator';
import { Pagination } from 'src/helpers/decorator/pagination.decorator';
import { Filtering } from 'src/helpers/decorator/filtering.decorator';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<User | any> {
    try {
      const user: User = new User();
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.city = createUserDto.city;
      user.email = createUserDto.email;
      user.phone = createUserDto.phone;
      user.password = createUserDto.password;
      const userDetails = await this.userRepository.save(user);
      return classToPlain(userDetails);
    } catch (error) {
      return error;
    }
  }

  async logIn(loginUserDto: LoginUserDto): Promise<User | any> {
    try {
      const findUser = await this.userRepository.findOneBy({
        email: loginUserDto.email,
      });
      const access_token = await this.authService.authentication(findUser.id);
      const data = classToPlain(findUser);
      return { ...data, access_token };
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const findUser = await this.userRepository.findOneBy({
        id: id,
      });
      if (!findUser) {
        return findUser;
      }
      return classToPlain(findUser);
    } catch (error) {
      return error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const checkUser = await this.userRepository.findOneBy({ id: id });
      if (!checkUser) return checkUser;
      Object.assign(checkUser, updateUserDto);
      await this.userRepository.save(checkUser);
      return classToPlain(checkUser);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteUser(id: string) {
    try {
      const getUser = await this.userRepository.findOneBy({ id: id });
      if (getUser) {
        await this.userRepository.delete({ id: id });
        return classToPlain(getUser);
      } else {
        return getUser;
      }
    } catch (error) {
      return error;
    }
  }

  async fetchAll(
    { page, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<Record<string, any>> {
    try {
      const where = getWhere(filter);
      const order = getOrder(sort);
      const [languages, total] = await this.userRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: offset,
      });
      return classToPlain({ totalItems: total, items: languages, page, limit });
    } catch (error) {
      return error;
    }
  }
}
