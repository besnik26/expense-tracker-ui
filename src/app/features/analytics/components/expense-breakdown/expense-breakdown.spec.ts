import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseBreakdown } from './expense-breakdown';

describe('ExpenseBreakdown', () => {
  let component: ExpenseBreakdown;
  let fixture: ComponentFixture<ExpenseBreakdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseBreakdown],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseBreakdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
