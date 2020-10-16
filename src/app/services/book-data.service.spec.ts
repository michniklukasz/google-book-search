import { TestBed } from '@angular/core/testing';

import { BookDataService } from './book-data.service';

describe('BookDataService', () => {
  let service: BookDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BookDataService ]
    });
    service = TestBed.inject(BookDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
