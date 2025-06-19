import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import prisma from '../../../../packages/db/index'
import { CreateUserDTO, FindUserQueryDTO, UpdateUserDTO } from 'src/DTO/user.dto';


@Injectable()
export class UserService {

  async getUser(userQuery: FindUserQueryDTO) {
    async function getUserByEmail(email: string) {
      const user = await prisma.user.findUnique({where:{email},include:{friends:true,friendsOf:true}})

      if (!user) return null

      return user
    }
    
    async function getUserById(id: string) {
      const user = await prisma.user.findUnique({where:{id},include:{friends:true,friendsOf:true}})

      if (!user) return null

      return user
    }

    async function getUserByName(name: string) {
      const user = await prisma.user.findUnique({where:{name},include:{friends:true,friendsOf:true}})

      if (!user) return null

      return user
    }

    if (Object.keys(userQuery).length === 0 || Object.keys(userQuery).length > 1) {
      throw new BadRequestException("You must include either name, email, or id of user you're trying to find or do something with")
    }

    if (userQuery.email) {
      return await getUserByEmail(userQuery.email)
    }

    if (userQuery.id) {
      return await getUserById(userQuery.id)
    }

    if (userQuery.name) {
      return await getUserByName(userQuery.name)
    }
  }

  async createUser(createUserDTO: CreateUserDTO) {
    return await prisma.user.create({
      data:{
        ...createUserDTO
      },
      include: {friends:true,friendsOf:true}
    })
  }


  async deleteUser(userQuery: FindUserQueryDTO) {
    const user = await this.getUser(userQuery)

    if (!user) { throw new NotFoundException(`User does not exist`) }

    return await prisma.user.delete({ where: {id:user.id} })
  }

  async updateUser(pii: FindUserQueryDTO, data: UpdateUserDTO) {
    const user = await this.getUser(pii)

    if (!user) {throw new NotFoundException('User does not exist')}

    return await prisma.user.update({
      where: {id: user.id},
      data: {
        ...data
      }
    })
  }
}
