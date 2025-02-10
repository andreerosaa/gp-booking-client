import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminBookingDialogComponent } from './admin-booking-dialog.component';

describe('AdminBookingDialogComponent', () => {
  let component: AdminBookingDialogComponent;
  let fixture: ComponentFixture<AdminBookingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBookingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
