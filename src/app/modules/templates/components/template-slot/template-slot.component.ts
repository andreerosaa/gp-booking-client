import { Component, input } from '@angular/core';
import { TemplateModel } from '../../../../models/template.model';

@Component({
  selector: 'app-template-slot',
  standalone: false,
  
  templateUrl: './template-slot.component.html',
  styleUrl: './template-slot.component.scss'
})
export class TemplateSlotComponent {
  template = input.required<TemplateModel>();
}
