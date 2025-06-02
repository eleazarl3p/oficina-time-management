import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterModalComponent } from './cost-center-modal.component';

describe('CostCenterModalComponent', () => {
  let component: CostCenterModalComponent;
  let fixture: ComponentFixture<CostCenterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostCenterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
