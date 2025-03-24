import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class FilterReportDto {
  @ApiProperty({
    type: Number,
    description: 'divisi_id',
  })
  @Type(() => Number)
  @IsInt()
  divisi_id?: number;
}
