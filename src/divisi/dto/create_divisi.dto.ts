import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createDivisiDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minimum: 3 })
  nama_divisi: string;
}
