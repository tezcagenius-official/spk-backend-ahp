import { Controller, Get, Query, Res, ValidationPipe } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';
import { FilterReportDto } from './dto/filter_report.dto';

@ApiTags('Report')
@Controller('/api/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
  @Get('excel')
  async excel(
    @Res() res: Response,
    @Query(new ValidationPipe({ transform: true })) filter: FilterReportDto,
  ) {
    try {
      return this.reportService.exportToExcel(res, filter.divisi_id);
    } catch (error) {
      console.log(error);
    }
  }
}
