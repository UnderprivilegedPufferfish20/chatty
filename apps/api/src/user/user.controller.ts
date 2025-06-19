import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, FindUserQueryDTO, UpdateUserDTO } from 'src/DTO/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserBy(@Query() userQuery: FindUserQueryDTO) {
    return this.userService.getUser(userQuery)
  }
  
  @Patch()
  async updateUser(
    @Query() userQuery: FindUserQueryDTO,
    @Body()  data: UpdateUserDTO
  ) {
    return this.userService.updateUser(userQuery, data)
  }

  @Delete()
  async deleteUser(@Query() userQuery: FindUserQueryDTO) {
    return this.userService.deleteUser(userQuery)
  }

  @Post()
  async createUser(
    @Body()  data: CreateUserDTO
  ) {
    return this.userService.createUser(data)
  }
}
