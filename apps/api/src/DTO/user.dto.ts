import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDTO {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  pfpURL: string
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  pfpUrl?: string
}

export class FindUserQueryDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  id?: string


  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  friendCode?: string
}