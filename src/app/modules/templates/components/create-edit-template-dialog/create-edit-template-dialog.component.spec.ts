import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditTemplateDialogComponent } from './create-edit-template-dialog.component';

describe('CreateEditTemplateDialogComponent', () => {
  let component: CreateEditTemplateDialogComponent;
  let fixture: ComponentFixture<CreateEditTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateEditTemplateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
