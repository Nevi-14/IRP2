import { TestBed } from '@angular/core/testing';

import { GuiaEntregasService } from './guia-entregas.service';

describe('GuiaEntregasService', () => {
  let service: GuiaEntregasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuiaEntregasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
