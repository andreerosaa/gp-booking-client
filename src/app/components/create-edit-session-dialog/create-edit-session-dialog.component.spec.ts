import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditSessionDialogComponent } from './create-edit-session-dialog.component';

describe('CreateEditSessionDialogComponent', () => {
  let component: CreateEditSessionDialogComponent;
  let fixture: ComponentFixture<CreateEditSessionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateEditSessionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditSessionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
