import { Test, TestingModule } from '@nestjs/testing';
import { PerhitunganController } from './perhitungan.controller';
import { PerhitunganService } from './perhitungan.service';

describe('PerhitunganController', () => {
  let controller: PerhitunganController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerhitunganController],
      providers: [PerhitunganService],
    }).compile();

    controller = module.get<PerhitunganController>(PerhitunganController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
