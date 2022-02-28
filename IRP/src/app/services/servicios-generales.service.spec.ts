import { TestBed } from '@angular/core/testing';

import { ServiciosGeneralesService } from './servicios-generales.service';

describe('ServiciosGeneralesService', () => {
  let service: ServiciosGeneralesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosGeneralesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
