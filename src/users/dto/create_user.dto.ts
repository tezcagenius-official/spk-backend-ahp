import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export enum UserRole {
  adm = 'adm',
  spa = 'spa',
}

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username', example: 'admin' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password', example: 'admin123' })
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Role',
    enum: UserRole,
    enumName: 'UserRole',
  })
  role: keyof typeof UserRole;
}
