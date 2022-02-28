import { TestBed } from '@angular/core/testing';

import { PlanificacionEntregasService } from './planificacion-entregas.service';

describe('PlanificacionEntregasService', () => {
  let service: PlanificacionEntregasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanificacionEntregasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
