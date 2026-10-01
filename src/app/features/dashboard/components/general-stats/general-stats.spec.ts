import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralStats } from './general-stats';

describe('GeneralStats', () => {
  let component: GeneralStats;
  let fixture: ComponentFixture<GeneralStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralStats],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
