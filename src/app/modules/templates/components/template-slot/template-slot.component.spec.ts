import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSlotComponent } from './template-slot.component';

describe('TemplateSlotComponent', () => {
  let component: TemplateSlotComponent;
  let fixture: ComponentFixture<TemplateSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateSlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
