import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavingTrend } from './saving-trend';

describe('SavingTrend', () => {
  let component: SavingTrend;
  let fixture: ComponentFixture<SavingTrend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingTrend],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingTrend);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
