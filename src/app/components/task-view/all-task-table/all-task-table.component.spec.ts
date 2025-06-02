import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTaskTableComponent } from './all-task-table.component';

describe('AllTaskTableComponent', () => {
  let component: AllTaskTableComponent;
  let fixture: ComponentFixture<AllTaskTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTaskTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTaskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
