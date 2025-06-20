import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import prisma from '../../../../packages/db/index'
import { CreateUserDTO, FindUserQueryDTO, UpdateUserDTO } from 'src/DTO/user.dto';


@Injectable()
export class UserService {

  async getUser(userQuery: FindUserQueryDTO) {
    const queryKeys = Object.keys(userQuery);
    if (queryKeys.length !== 1) {
      throw new BadRequestException(
        "You must include exactly one of: name, email, friendCode, or id"
      );
    }

    // Map query fields to database fields
    const fieldMap = {
      email: 'email',
      id: 'id', 
      name: 'name',
      friendCode: 'friendCode'
    };

    const [queryField] = queryKeys;
    const dbField = fieldMap[queryField as keyof typeof fieldMap];
    const queryValue = userQuery[queryField as keyof FindUserQueryDTO];

    if (!dbField) {
      throw new BadRequestException("Invalid query field");
    }

    return await prisma.user.findUnique({
      where: { [dbField]: queryValue } as any,
      include: {
        friends:true,
        friendsOf: true
      }
    });
  }

  private async generateFriendCode() {
    let iter = 0;
    while (iter <= 100) {
      const code = Array.from({length: 6}, () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
      ).join('');

      const testIfUnique = await prisma.user.findUnique({ where: { friendCode: code } });

      if (!testIfUnique) {
        return code;
      }
      iter++;
    }
    throw new InternalServerErrorException("Could not generate unique friend code");
  }


  async createUser(createUserDTO: CreateUserDTO) {
    const code = await this.generateFriendCode()

    return await prisma.user.create({
      data:{
        ...createUserDTO,
        friendCode: code
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
