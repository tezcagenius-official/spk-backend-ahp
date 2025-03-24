import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class EditAlternatifDTO {
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
