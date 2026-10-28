import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalStats } from './total-stats';

describe('TotalStats', () => {
  let component: TotalStats;
  let fixture: ComponentFixture<TotalStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalStats],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
