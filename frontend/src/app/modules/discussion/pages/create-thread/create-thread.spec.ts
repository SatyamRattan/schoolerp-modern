import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateThread } from './create-thread';

describe('CreateThread', () => {
  let component: CreateThread;
  let fixture: ComponentFixture<CreateThread>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateThread]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateThread);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
