import { Test, TestingModule } from '@nestjs/testing';
import { SubKriteriaController } from './sub_kriteria.controller';
import { SubKriteriaService } from './sub_kriteria.service';

describe('SubKriteriaController', () => {
  let controller: SubKriteriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubKriteriaController],
      providers: [SubKriteriaService],
    }).compile();

    controller = module.get<SubKriteriaController>(SubKriteriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
