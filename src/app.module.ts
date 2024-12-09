import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CriteriaModule } from './criteria/criteria.module';
import { PenilaianModule } from './penilaian/penilaian.module';
import { PerhitunganModule } from './perhitungan/perhitungan.module';
import { SubKriteriaModule } from './sub_kriteria/sub_kriteria.module';
import { PerbandinganKriteriaModule } from './perbandingan_kriteria/perbandingan_kriteria.module';

@Module({
  imports: [AuthModule, CriteriaModule, PenilaianModule, PerhitunganModule, SubKriteriaModule, PerbandinganKriteriaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
