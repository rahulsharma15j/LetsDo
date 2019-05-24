import { TestBed, async, inject } from '@angular/core/testing';

import { UserRouteGuard } from './user-route.guard';

describe('UserRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserRouteGuard]
    });
  });

  it('should ...', inject([UserRouteGuard], (guard: UserRouteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
