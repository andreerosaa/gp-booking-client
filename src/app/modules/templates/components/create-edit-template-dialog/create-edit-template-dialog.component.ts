import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TherapistService } from '../../../../services/therapist/therapist.service';
import { SnackBarService } from '../../../../services/snack-bar/snack-bar.service';
import { CreateEditTemplateDialogData, CreateTemplateForm, CreateTemplateFormValue, EditTemplateForm } from '../../../../models/template.model';
import { environment } from '../../../../../environments/environment.development';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseIdentification } from '../../../../models/base.model';
import { map, Observable, startWith } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TherapistModel } from '../../../../models/therapist.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { TemplateService } from '../../../../services/template/template.service';

@Component({
	selector: 'app-create-edit-template-dialog',
	standalone: false,
	templateUrl: './create-edit-template-dialog.component.html',
	styleUrl: './create-edit-template-dialog.component.scss'
})
export class CreateEditTemplateDialogComponent implements OnInit {
	private readonly _dialogRef = inject(MatDialogRef<CreateEditTemplateDialogComponent>);
	private readonly _therapistService = inject(TherapistService);
	private readonly _templateService = inject(TemplateService);
	private readonly _snackBarService = inject(SnackBarService);
	
	protected readonly data = inject<CreateEditTemplateDialogData>(MAT_DIALOG_DATA);
	protected readonly maxLength = 50;
	protected readonly timeInterval = `${environment.TIMEPICKER_INTERVAL_MINUTES}min`;

	createTemplateForm!: FormGroup<Partial<CreateTemplateForm>>;
	editTemplateForm!: FormGroup<Partial<EditTemplateForm>>;

	therapists: BaseIdentification[] = [];
	filteredTherapists!: Observable<BaseIdentification[]>;
	loading = true;

	ngOnInit() {
		this.searchTherapists();
		this.buildForm();
	}

	buildForm() {
		if (!this.data.template) {
			this.createTemplateForm = new FormGroup<Partial<CreateTemplateForm>>({
				name: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)]),
				startTimes: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)]),
				therapist: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)]),
				durationInMinutes: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)]),
				vacancies: new FormControl({ value: 1, disabled: true }, [Validators.required, Validators.maxLength(this.maxLength)])
			});
		}
	}

	searchTherapists() {
		this._therapistService
			.getTherapists()
			.pipe(
				map((therapists: TherapistModel[]): BaseIdentification[] => {
					return therapists.map((therapist: TherapistModel): BaseIdentification => {
						return { id: therapist._id, name: therapist.name };
					});
				})
			)
			.subscribe({
				next: (therapists: BaseIdentification[]) => {
					this.therapists = [...therapists];
				},
				complete: () => {
					this.loading = false;
					this.filterTherapists();
				},
				error: (error: HttpErrorResponse) => {
					this.loading = false;
					console.error(error);
					this._snackBarService.openErrorSnackBar('Erro a pesquisar terapeutas');
				}
			});
	}

	filterTherapists() {
		this.filteredTherapists = this.getTherapistControl.valueChanges.pipe(
			startWith(''),
			map((filterValue: string) => this.therapists.filter((option) => option.name.toLowerCase().includes(filterValue)))
		);
	}

	createTemplate() {
		if (this.createTemplateForm.invalid) {
			return;
		}

		this.loading = true;
		this._templateService.createTemplate(this.createTemplateForm.getRawValue() as CreateTemplateFormValue).subscribe({
			complete: () => {
				this.loading = false;
				this._snackBarService.openSuccessSnackBar('Template criado com sucesso');
				this.closeDialog(true);
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.error(error);
				this._snackBarService.openErrorSnackBar('Erro a criar template');
			}
		});
	}

	closeDialog(refresh?: boolean): void {
		this._dialogRef.close(refresh);
	}

	add(event: MatChipInputEvent): void {
		const now = new Date();
		const value = (event.value || '').trim();
		const [hours, minutes] = value.split(':').map(Number);
		now.setHours(hours, minutes, 0);

		if (now instanceof Date && !isNaN(now.getTime())) {
			this.getStartTimesControl.value.push(value);
		}

		event.chipInput.clear();
	}

	remove(time: Date): void {
		const index = this.getStartTimesControl.value.indexOf(time);
		if (index < 0) {
			return;
		}

		this.getStartTimesControl.value.splice(index, 1);
	}

	autocompleteDisplay(therapist: TherapistModel): string {
		return therapist?.name ? therapist.name : '';
	}

	get getNameControl(): FormControl {
		return this.createTemplateForm.get('name') as FormControl;
	}
	get getStartTimesControl(): FormControl {
		return this.createTemplateForm.get('startTimes') as FormControl;
	}
	get getTherapistControl(): FormControl {
		return this.createTemplateForm.get('therapist') as FormControl;
	}
	get getDurationControl(): FormControl {
		return this.createTemplateForm.get('durationInMinutes') as FormControl;
	}
	get getVacanciesControl(): FormControl {
		return this.createTemplateForm.get('vacancies') as FormControl;
	}
}
