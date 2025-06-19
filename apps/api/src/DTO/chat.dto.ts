import { IsUUID, IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateChatDto {
  @IsUUID()
  friendRelId: string;

  @IsString()
  message: string;

  @IsOptional()
  attachment?: Buffer;

  @IsString()
  senderId: string

  @IsString()
  receiverId: string
}

export class UpdateChatDto {
  @IsOptional()
  @IsBoolean()
  seen?: boolean;

  @IsOptional()
  @IsDateString()
  seenAt?: string;
}
