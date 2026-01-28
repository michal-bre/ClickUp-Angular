import { TestBed } from '@angular/core/testing';

import { Teams } from './teams.services';

describe('Teams', () => {
  let service: Teams;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Teams);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
