import { ApiProperty } from '@nestjs/swagger';

export class getResponseDivisiDto {
  @ApiProperty({ example: 1 })
  divisi_id: number;

  @ApiProperty({ example: 'Mekanik' })
  nama_divisi: string;
}
