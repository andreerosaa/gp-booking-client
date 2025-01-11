import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateFromTemplateDialogComponent } from './create-from-template-dialog.component';

describe('CreateFromTemplateDialogComponent', () => {
  let component: CreateFromTemplateDialogComponent;
  let fixture: ComponentFixture<CreateFromTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateFromTemplateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFromTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
