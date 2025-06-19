import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendRelationDto, FindFriendRelDto } from 'src/DTO/friend.dto';


@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  create(@Body() createFriendDto: CreateFriendRelationDto) {
    return this.friendsService.create(createFriendDto);
  }

  @Get()
  findOne(
    @Query() query: FindFriendRelDto
  ) {
    return this.friendsService.findOne(query);
  }

  @Delete()
  remove(
    @Query() query: FindFriendRelDto
  ) {
    return this.friendsService.remove(query);
  }
}
