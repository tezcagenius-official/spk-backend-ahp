import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetAlternatifByDivisiDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  alternatif_id: number;

  @ApiProperty({ example: 'Udin' })
  @IsString()
  nama: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  divisi_id: number;
}
