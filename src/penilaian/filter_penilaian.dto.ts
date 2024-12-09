import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class filterPenilaianDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  nisn: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  nama_siswa: string;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  page: number;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  perPage: number;
}
