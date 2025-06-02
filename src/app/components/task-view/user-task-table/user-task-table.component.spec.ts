import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTaskTableComponent } from './user-task-table.component';

describe('UserTaskTableComponent', () => {
  let component: UserTaskTableComponent;
  let fixture: ComponentFixture<UserTaskTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTaskTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTaskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
