import { TestBed } from '@angular/core/testing';

import { JavascriptDatesService } from './javascript-dates.service';

describe('JavascriptDatesService', () => {
  let service: JavascriptDatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JavascriptDatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
