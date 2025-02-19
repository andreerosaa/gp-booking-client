import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateFromTemplateDialogData, CreateFromTemplateForm, CreateFromTemplateFormValue } from '../../models/session.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { map, Observable, startWith } from 'rxjs';
import { SessionService } from '../../services/session/session.service';
import { TemplateService } from '../../services/template/template.service';
import { TemplateModel } from '../../models/template.model';

@Component({
	selector: 'app-create-from-template-dialog',
	standalone: false,
	templateUrl: './create-from-template-dialog.component.html',
	styleUrl: './create-from-template-dialog.component.scss'
})
export class CreateFromTemplateDialogComponent implements OnInit {
	private readonly _dialogRef = inject(MatDialogRef<CreateFromTemplateDialogComponent>);
	private readonly _snackBarService = inject(SnackBarService);
	private readonly _templateService = inject(TemplateService);
	private readonly _sessionService = inject(SessionService);
	
	protected readonly data = inject<CreateFromTemplateDialogData>(MAT_DIALOG_DATA);
	protected readonly maxLength = 50;

	createFromTemplateForm!: FormGroup<Partial<CreateFromTemplateForm>>;
	templates: TemplateModel[] = [];
	filteredTemplates!: Observable<TemplateModel[]>;
	loading = true;

	ngOnInit() {
		this.searchTemplatess();
		this.buildForm();
	}

	buildForm() {
		this.createFromTemplateForm = new FormGroup<Partial<CreateFromTemplateForm>>({
			template: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)]),
		});
	}

	searchTemplatess() {
		this._templateService.getTemplates().subscribe({
			next: (templates: TemplateModel []) => {
				this.templates = [...templates];
			},
			complete: () => {
				this.loading = false;
				this.filterTemplates();
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.error(error);
				this._snackBarService.openErrorSnackBar('Erro a pesquisar templates');
			}
		});
	}

	filterTemplates() {
		this.filteredTemplates = this.getTemplateControl.valueChanges.pipe(
			startWith(''),
			map((filterValue: string) => this.templates.filter((option) => option.name.toLowerCase().includes(filterValue)))
		);
	}

	createFromTemplate() {
		if (this.createFromTemplateForm.invalid) {
			return;
		}

		this.loading = true;
		this._sessionService.createFromTemplate(this.data.date, this.createFromTemplateForm.getRawValue() as CreateFromTemplateFormValue).subscribe({
			complete: () => {
				this.loading = false;
				this._snackBarService.openSuccessSnackBar('Dia preenchido com sucesso');
				this.closeDialog(true);
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.error(error);
				switch(error.status) {
					case HttpStatusCode.Forbidden:
						this._snackBarService.openErrorSnackBar('Não é possível criar sessões anteriores à hora atual');
						break;
					default:
						this._snackBarService.openErrorSnackBar('Erro a preencher o dia');
						break;
				}
			}
		});
	}

	closeDialog(refresh?: boolean) {
		this._dialogRef.close(refresh);
	}

	autocompleteDisplay(template: TemplateModel): string {
		return template?.name ? template.name : '';
	}

	get getTemplateControl(): FormControl {
		return this.createFromTemplateForm.get('template') as FormControl;
	}
}
