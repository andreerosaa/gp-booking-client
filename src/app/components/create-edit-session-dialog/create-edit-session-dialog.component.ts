import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateEditSessionDialogData, CreateSessionForm, CreateSessionFormValue } from '../../models/session.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { TherapistService } from '../../services/therapist/therapist.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { TherapistModel } from '../../models/therapist.model';
import { map, Observable, startWith } from 'rxjs';
import { SessionService } from '../../services/session/session.service';


@Component({
	selector: 'app-create-edit-session-dialog',
	standalone: false,
	templateUrl: './create-edit-session-dialog.component.html',
	styleUrl: './create-edit-session-dialog.component.scss'
})
export class CreateEditSessionDialogComponent implements OnInit{

	private readonly dialogRef = inject(MatDialogRef<CreateEditSessionDialogComponent>);
	private readonly _therapistService = inject(TherapistService);
	private readonly _snackBarService = inject(SnackBarService);
	private readonly _sessionService = inject(SessionService);
	protected readonly data = inject<CreateEditSessionDialogData>(MAT_DIALOG_DATA);
	protected readonly maxLength = 50;
	protected readonly timeInterval = `${environment.TIMEPICKER_INTERVAL_MINUTES}min`;
	
	createSessionForm!: FormGroup<Partial<CreateSessionForm>>;
	editSessionForm!: FormGroup<any>;
	therapists: TherapistModel[] = [];
	filteredTherapists!: Observable<TherapistModel[]>;
	loading = true;

	ngOnInit() {
		this.searchTherapists();
		this.buildForm();
	}

	buildForm() {
		if(!this.data.session) {
			this.createSessionForm = new FormGroup<Partial<CreateSessionForm>>({
				date: new FormControl(this.data.date, [Validators.required, Validators.maxLength(this.maxLength)]),
				therapist: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)]),
				durationInMinutes: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)]),
				vacancies: new FormControl({value:1, disabled: true}, [Validators.required, Validators.maxLength(this.maxLength)]),
			});
		} else {
			//TODO: build edit form
		}
	}

	searchTherapists() {
		this._therapistService.getTherapists().subscribe({
					next: (therapists: TherapistModel[]) => {
						this.therapists = [...therapists];
					},
					complete: () => {
						this.loading = false;
						this.filterTherapists();
					},
					error: (error: HttpErrorResponse) => {
						this.loading = false;
						console.log(error);
						this._snackBarService.openErrorSnackBar('Erro a pesquisar terapeutas login');
					}
				});
	}

	filterTherapists() {
		this.filteredTherapists = this.getTherapistControl.valueChanges.pipe(
			startWith(''),
			map((filterValue: string) => this.therapists.filter(option => option.name.toLowerCase().includes(filterValue))),
		  );
	}

	createSession() {
		if(this.createSessionForm.invalid) {
			return;
		}

		this.loading = true;
		this._sessionService.createSession(this.createSessionForm.getRawValue() as CreateSessionFormValue).subscribe({
			complete: () => {
				this.loading = false;
				this._snackBarService.openSuccessSnackBar('Sessão criada com sucesso');
				this.closeDialog(true);
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.log(error);
				this._snackBarService.openErrorSnackBar('Erro a criar sessão');
			}
		})
	}

	closeDialog(refresh?: boolean): void {
		this.dialogRef.close(refresh);
	}

	autocompleteDisplay(therapist: TherapistModel): string {
		return therapist?.name ? therapist.name : '';
	}

	get getDateControl(): FormControl {
		return this.createSessionForm.get('date') as FormControl;
	}
	get getTherapistControl(): FormControl {
		return this.createSessionForm.get('therapist') as FormControl;
	}
	get getDurationControl(): FormControl {
		return this.createSessionForm.get('durationInMinutes') as FormControl;
	}
	get getVacanciesControl(): FormControl {
		return this.createSessionForm.get('vacancies') as FormControl;
	}
}
