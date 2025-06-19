import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFriendRelationDto, FindFriendRelDto } from 'src/DTO/friend.dto';
import prisma from '../../../../packages/db';


@Injectable()
export class FriendsService {
  async create(createFriendDto: CreateFriendRelationDto) {
    if (createFriendDto.userId === createFriendDto.friendId) throw new BadRequestException('A user cannot be friends with themselves');

    const user1 = await prisma.user.findUnique({
      where: {id: createFriendDto.userId}
    })

    const user2 = await prisma.user.findUnique({
      where: {id: createFriendDto.friendId}
    })

    if (!user1 || !user2) {
      throw new NotFoundException(`One of the users does not exist`)
    }

    const friendRel = await this.findOne({ personOneID: createFriendDto.userId, personTwoID: createFriendDto.friendId })

    if (friendRel) throw new BadRequestException("These two users are already friends");

    return await prisma.friendRelation.create({
      data: {
        ...createFriendDto
      }
    })

      
  }


  async findOne(q: FindFriendRelDto) {
    const hasUserIds = q.personOneID && q.personTwoID;
    const hasRelId = !!q.relId;

    // Must provide either both user IDs or the relId, but not both or neither
    if ((hasUserIds && hasRelId) || (!hasUserIds && !hasRelId)) {
      throw new BadRequestException(
        "Provide either both user IDs or the friend rel id, but not both or neither."
      );
    }

    if (hasUserIds) {
      return await prisma.friendRelation.findFirst({
        where: {
          OR: [
            { userId: q.personOneID, friendId: q.personTwoID },
            { userId: q.personTwoID, friendId: q.personOneID }
          ]
        },
        include: { chats: { orderBy: { seenAt: 'desc' } }, friend: true, user: true }
      });
    }

    if (hasRelId) {
      return await prisma.friendRelation.findUnique({
        where: { id: q.relId }
      });
    }
  }


  async remove(q: FindFriendRelDto) {
    const friendRel = await this.findOne({ personOneID: q.personOneID, personTwoID: q.personTwoID })

    if (!friendRel) throw new BadRequestException("These two users were never friends");

    return await prisma.friendRelation.delete({
      where: {
        id: friendRel.id
      }
    })
  }
}
