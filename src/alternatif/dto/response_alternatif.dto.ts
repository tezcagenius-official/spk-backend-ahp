import { ApiProperty } from '@nestjs/swagger';

export class ResponseAlternatifDTO {
  @ApiProperty({ example: 1 })
  alternatif_id: number;

  @ApiProperty({ example: 'Budi' })
  nama: string;

  @ApiProperty({ example: 'budi@gmail.com' })
  email: string;

  @ApiProperty({ example: '08868641747' })
  nomor_telpon: string;
}
