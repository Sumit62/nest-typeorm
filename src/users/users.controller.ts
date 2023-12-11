import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/constants';
import {
  Pagination,
  PaginationParams,
} from 'src/helpers/decorator/pagination.decorator';
import {
  Filtering,
  FilteringParams,
} from 'src/helpers/decorator/filtering.decorator';
import {
  Sorting,
  SortingParams,
} from 'src/helpers/decorator/shorting.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe())
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.signUp(createUserDto);
    } catch (error) {
      return error;
    }
  }
  @Public()
  @Post('login')
  @UsePipes(new ValidationPipe())
  async logIn(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.logIn(loginUserDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
  @Get()
  fetchAll(
    // localhost:3000/users?page=1&limit=2
    @PaginationParams() paginationParams: Pagination,
    // localhost:3000/users?sort=firstName:desc // asc or desc
    @SortingParams(['firstName', 'lastName', 'isActive', 'email'])
    sort?: Sorting,
    // localhost:3000/users?filter=firstName:eq:first01 //filtering
    // localhost:3000/users?filter=firstName:like:first //searching
    @FilteringParams(['firstName', 'lastName', 'isActive', 'email', 'phone'])
    filter?: Filtering,
  ) {
    return this.usersService.fetchAll(paginationParams, sort, filter);
  }
}
