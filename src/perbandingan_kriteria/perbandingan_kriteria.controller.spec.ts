import { Test, TestingModule } from '@nestjs/testing';
import { PerbandinganKriteriaController } from './perbandingan_kriteria.controller';
import { PerbandinganKriteriaService } from './perbandingan_kriteria.service';

describe('PerbandinganKriteriaController', () => {
  let controller: PerbandinganKriteriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerbandinganKriteriaController],
      providers: [PerbandinganKriteriaService],
    }).compile();

    controller = module.get<PerbandinganKriteriaController>(PerbandinganKriteriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
