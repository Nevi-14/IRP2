import { TestBed } from '@angular/core/testing';

import { PlanificacionEntregasGestionCamionesService } from './planificacion-entregas-gestion-camiones.service';

describe('PlanificacionEntregasGestionCamionesService', () => {
  let service: PlanificacionEntregasGestionCamionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanificacionEntregasGestionCamionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
