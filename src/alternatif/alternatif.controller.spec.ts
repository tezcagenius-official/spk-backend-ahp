import { Test, TestingModule } from '@nestjs/testing';
import { AlternatifController } from './alternatif.controller';
import { AlternatifService } from './alternatif.service';

describe('AlternatifController', () => {
  let controller: AlternatifController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlternatifController],
      providers: [AlternatifService],
    }).compile();

    controller = module.get<AlternatifController>(AlternatifController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
