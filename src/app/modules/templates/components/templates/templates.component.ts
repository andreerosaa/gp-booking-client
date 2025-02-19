import { Component, inject, OnInit, viewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TemplateService } from '../../../../services/template/template.service';
import { TemplateModel } from '../../../../models/template.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditTemplateDialogComponent } from '../create-edit-template-dialog/create-edit-template-dialog.component';

@Component({
	selector: 'app-templates',
	standalone: false,
	templateUrl: './templates.component.html',
	styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnInit {
	private readonly _templateService = inject(TemplateService);
	private readonly _dialog = inject(MatDialog);

	accordion = viewChild.required(MatAccordion);
	templates: TemplateModel[] = [];
	searching = true;

	ngOnInit() {
	  this.getTemplates();
	}

	getTemplates() {
		this._templateService.getTemplates().subscribe({
			next: (templates: TemplateModel[]) => {
				this.templates = [...templates];
			},
			complete: () => {
				this.searching = false;
			},
			error: (error: HttpErrorResponse) => {
				console.error(error);
				this.searching = false;
			}
		});
	}

	openAddTemplateDialog() {
		const dialogRef = this._dialog.open(CreateEditTemplateDialogComponent, { data: {} });
		dialogRef.afterClosed().subscribe((result: boolean) => {
			if (result) {
				this.getTemplates();
			}
		});
	}
}
