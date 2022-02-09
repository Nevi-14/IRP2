import { TestBed } from '@angular/core/testing';

import { ActualizaFacturaGuiasService } from './actualiza-factura-guias.service';

describe('ActualizaFacturaGuiasService', () => {
  let service: ActualizaFacturaGuiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualizaFacturaGuiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
