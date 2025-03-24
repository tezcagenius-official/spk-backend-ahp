import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { paginationDekoratorDto } from 'src/common/interface/paginationDekorator';

export class ResponseAlternatifDTO {
  @ApiProperty({ example: 1 })
  alternatif_id: number;

  @ApiProperty({ example: 'Budi' })
  nama: string;

  @ApiProperty({ example: 'budi@gmail.com' })
  email: string;

  @ApiProperty({ example: '08868641747' })
  nomor_telpon: string;

  @ApiProperty({ example: '1' })
  divisi_id: number;

  @ApiProperty({ example: 'Supervisor' })
  nama_divisi: string;
}

export class AlternatifFilterDto extends paginationDekoratorDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'divisi_id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  divisi_id?: number;
}
