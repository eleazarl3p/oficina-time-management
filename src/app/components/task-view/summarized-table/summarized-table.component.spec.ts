import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizedTableComponent } from './summarized-table.component';

describe('SummarizedTableComponent', () => {
  let component: SummarizedTableComponent;
  let fixture: ComponentFixture<SummarizedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummarizedTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummarizedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
