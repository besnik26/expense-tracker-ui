import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpendingProgress } from './spending-progress';

describe('SpendingProgress', () => {
  let component: SpendingProgress;
  let fixture: ComponentFixture<SpendingProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingProgress],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingProgress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
