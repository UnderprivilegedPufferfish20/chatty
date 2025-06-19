import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from '../../../../packages/db';
import { FriendsService } from 'src/friends/friends.service';
import { CreateChatDto } from 'src/DTO/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly friendService: FriendsService
  ) {}

  async createChat(data: CreateChatDto) {
    const friendRel = await this.friendService.findOne({ relId:data.friendRelId })

    if (!friendRel) throw new BadRequestException("The friend relation does not exist");

    const userIds = [friendRel.friendId, friendRel.userId]

    if (!(userIds.includes(data.senderId) && userIds.includes(data.receiverId))) {
      throw new BadRequestException("Sender and receiver are not the friendship");
    }

    return await prisma.chat.create({
      data: {
        ...data,
        seen: false
      }
    })
  }


  async markAsSeen(friendRelId:string, senderId:string) {
    const friends = await this.friendService.findOne({ relId: friendRelId })

    if (!friends) throw new BadRequestException("The friend relation does not exist");

    

    await prisma.chat.updateMany({
      where: {
        friendRelId,
        senderId
      },
      data: {
        seen:true,
        seenAt: new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })).toISOString()
      }
    })
  }
}
