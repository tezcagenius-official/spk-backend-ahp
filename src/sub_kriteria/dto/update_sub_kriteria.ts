import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class updateSubKriteriaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nama_sub_kriteria: string;
}
