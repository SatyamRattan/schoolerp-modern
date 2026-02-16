import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSchedule } from './exam-schedule';

describe('ExamSchedule', () => {
  let component: ExamSchedule;
  let fixture: ComponentFixture<ExamSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
