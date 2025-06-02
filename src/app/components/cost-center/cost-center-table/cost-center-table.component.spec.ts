import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterTableComponent } from './cost-center-table.component';

describe('CostCenterTableComponent', () => {
  let component: CostCenterTableComponent;
  let fixture: ComponentFixture<CostCenterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostCenterTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
