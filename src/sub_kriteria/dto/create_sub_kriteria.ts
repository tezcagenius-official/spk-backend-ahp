import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class createSubKriteriaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  kriteria_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nama_sub_kriteria: string;
}
