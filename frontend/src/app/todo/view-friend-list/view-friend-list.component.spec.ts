import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFriendListComponent } from './view-friend-list.component';

describe('ViewFriendListComponent', () => {
  let component: ViewFriendListComponent;
  let fixture: ComponentFixture<ViewFriendListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFriendListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFriendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
