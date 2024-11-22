import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionBookingDialogComponent } from './session-booking-dialog.component';

describe('SessionBookingDialogComponent', () => {
  let component: SessionBookingDialogComponent;
  let fixture: ComponentFixture<SessionBookingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionBookingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
