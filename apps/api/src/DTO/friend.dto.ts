import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFriendRelationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  friendId: string;
}

export class FindFriendRelDto {
  @IsOptional()
  @IsUUID()
  personOneID?: string

  @IsOptional()
  @IsUUID()
  personTwoID?: string

  @IsOptional()
  @IsUUID()
  relId?: string
}
