import { Test, TestingModule } from '@nestjs/testing';
import { PerbandinganSubKriteriaController } from './perbandingan_sub_kriteria.controller';
import { PerbandinganSubKriteriaService } from './perbandingan_sub_kriteria.service';

describe('PerbandinganSubKriteriaController', () => {
  let controller: PerbandinganSubKriteriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerbandinganSubKriteriaController],
      providers: [PerbandinganSubKriteriaService],
    }).compile();

    controller = module.get<PerbandinganSubKriteriaController>(PerbandinganSubKriteriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
