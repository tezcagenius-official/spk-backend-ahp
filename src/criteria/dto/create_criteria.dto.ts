import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class createCriteriaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minimum: 3 })
  nama_kriteria: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  divisi_id: number;
}
