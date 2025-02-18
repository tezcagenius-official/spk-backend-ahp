import { ApiProperty } from '@nestjs/swagger';

export class SubKriteriaResponseDto {
  @ApiProperty({ example: 1 })
  kriteria_id: number;

  @ApiProperty({ example: 'Baik' })
  nama_sub_kriteria: string;
}
