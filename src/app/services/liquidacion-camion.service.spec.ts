import { TestBed } from '@angular/core/testing';

import { LiquidacionCamionService } from './liquidacion-camion.service';

describe('LiquidacionCamionService', () => {
  let service: LiquidacionCamionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiquidacionCamionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
