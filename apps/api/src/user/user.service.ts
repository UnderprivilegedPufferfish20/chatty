import { Injectable } from '@nestjs/common';
import prisma from '../../../../packages/db/index'
import { CreateUserDTO } from 'src/DTO/user.dto';

@Injectable()
export class UserService {

  async createUser(createUserDTO: CreateUserDTO) {
    return await prisma.user.create({
      data:{
        ...createUserDTO
      }
    })
  }

  async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({where:{email}})

    if (!user) return null

    return user
  }

    async getUserById(id: string) {
    const user = await prisma.user.findUnique({where:{id}})

    if (!user) return null

    return user
  }

    async getUserByName(name: string) {
    const user = await prisma.user.findUnique({where:{name}})

    if (!user) return null

    return user
  }
}
