import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDTO {
  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiProperty({ example: 'Admin' })
  username: string;

  @ApiProperty({ example: 'adm' })
  role: string;
}
