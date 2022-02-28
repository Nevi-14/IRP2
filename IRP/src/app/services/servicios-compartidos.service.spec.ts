import { TestBed } from '@angular/core/testing';

import { ServiciosCompartidosService } from './servicios-compartidos.service';

describe('ServiciosCompartidosService', () => {
  let service: ServiciosCompartidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosCompartidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
