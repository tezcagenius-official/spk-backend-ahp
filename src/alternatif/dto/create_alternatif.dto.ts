import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlternatifDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nomor_telpon: string;
}
