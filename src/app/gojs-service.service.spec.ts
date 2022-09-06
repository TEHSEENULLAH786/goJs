import { TestBed } from '@angular/core/testing';

import { GojsServiceService } from './gojs-service.service';

describe('GojsServiceService', () => {
  let service: GojsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GojsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
