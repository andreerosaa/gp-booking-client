import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateEditSessionDialogData, CreateSessionForm, CreateSessionFormValue, EditSessionForm, EditSessionFormValue, SessionRecurrenceEnum, SessionRecurrenceMessages, SessionStatusEnum, SessionStatusMessages } from '../../models/session.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { TherapistService } from '../../services/therapist/therapist.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { TherapistModel } from '../../models/therapist.model';
import { map, Observable, startWith } from 'rxjs';
import { SessionService } from '../../services/session/session.service';
import { PatientService } from '../../services/patient/patient.service';
import { PatientModel } from '../../models/patient.model';
import { BaseIdentification, IdentificationWithEmail } from '../../models/base.model';

@Component({
	selector: 'app-create-edit-session-dialog',
	standalone: false,
	templateUrl: './create-edit-session-dialog.component.html',
	styleUrl: './create-edit-session-dialog.component.scss'
})
export class CreateEditSessionDialogComponent implements OnInit {
	private readonly dialogRef = inject(MatDialogRef<CreateEditSessionDialogComponent>);
	private readonly _therapistService = inject(TherapistService);
	private readonly _patientService = inject(PatientService);
	private readonly _snackBarService = inject(SnackBarService);
	private readonly _sessionService = inject(SessionService);
	protected readonly data = inject<CreateEditSessionDialogData>(MAT_DIALOG_DATA);
	protected readonly maxLength = 50;
	protected readonly timeInterval = `${environment.TIMEPICKER_INTERVAL_MINUTES}min`;
	protected readonly statuses = Object.values(SessionStatusEnum).filter((v) => !isNaN(Number(v))) as SessionStatusEnum[];
	protected readonly recurrenceTypes = Object.values(SessionRecurrenceEnum).filter((v) => !isNaN(Number(v))) as SessionRecurrenceEnum[];

	SessionStatusMessages = SessionStatusMessages;
	SessionRecurrenceMessages = SessionRecurrenceMessages;

	createSessionForm!: FormGroup<Partial<CreateSessionForm>>;
	editSessionForm!: FormGroup<any>;
	therapists: BaseIdentification[] = [];
	filteredTherapists!: Observable<BaseIdentification[]>;
	patients: IdentificationWithEmail[] = [];
	filteredPatients!: Observable<IdentificationWithEmail[]>;
	loading = true;

	ngOnInit() {
		this.searchTherapists();
		if(this.data.session?.patient) {
			this.searchPatients();
		}
		this.buildForm();
	}

	buildForm() {
		if (!this.data.session) {
			this.createSessionForm = new FormGroup<Partial<CreateSessionForm>>({
				date: new FormControl(new Date(this.data.date), [Validators.required, Validators.maxLength(this.maxLength)]),
				therapist: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)]),
				durationInMinutes: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)]),
				recurrence: new FormControl(null, [Validators.maxLength(this.maxLength)]),
				vacancies: new FormControl({ value: 1, disabled: true }, [Validators.required, Validators.maxLength(this.maxLength)])
			});
		} else {
			this.editSessionForm = new FormGroup<Partial<EditSessionForm>>({
				date: new FormControl(new Date(this.data.session.date), [Validators.required, Validators.maxLength(this.maxLength)]),
				therapist: new FormControl(this.data.session.therapist, [Validators.required, Validators.maxLength(this.maxLength)]),
				durationInMinutes: new FormControl(this.data.session.durationInMinutes, [Validators.required, Validators.maxLength(this.maxLength)]),
				status: new FormControl(this.data.session.status, [Validators.required, Validators.maxLength(this.maxLength)]),
				vacancies: new FormControl({ value: this.data.session.vacancies, disabled: true }, [Validators.required, Validators.maxLength(this.maxLength)]),
			});

			if(this.data.session.patient) {
				this.editSessionForm.addControl('patient', new FormControl(this.data.session.patient, [Validators.required, Validators.maxLength(this.maxLength)]))
			}	
		}
	}

	searchTherapists() {
		this._therapistService.getTherapists()
		.pipe(
			map((therapists: TherapistModel[]): BaseIdentification[] => {
				return therapists.map((therapist: TherapistModel): BaseIdentification => {
					return { id: therapist._id, name: therapist.name}
				})
			})
		)	
		.subscribe({
			next: (therapists: BaseIdentification []) => {
				this.therapists = [...therapists];
			},
			complete: () => {
				this.loading = false;
				this.filterTherapists();
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.log(error);
				this._snackBarService.openErrorSnackBar('Erro a pesquisar terapeutas');
			}
		});
	}

	searchPatients() {
		this._patientService.getPatients()
		.pipe(
			map((patients: PatientModel[]): IdentificationWithEmail[] => {
				return patients.map((patient: PatientModel): IdentificationWithEmail => {
					return { id: patient._id, name: patient.name, email: patient.email}
				})
			})
		)
		.subscribe({
			next: (patients: IdentificationWithEmail[]) => {
				this.patients = [...patients];
			},
			complete: () => {
				this.loading = false;
				this.filterPatients();
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.log(error);
				this._snackBarService.openErrorSnackBar('Erro a pesquisar clientes');
			}
		});
	}

	filterTherapists() {
		this.filteredTherapists = this.getTherapistControl.valueChanges.pipe(
			startWith(''),
			map((filterValue: string) => this.therapists.filter((option) => option.name.toLowerCase().includes(filterValue)))
		);
	}

	filterPatients() {
		this.filteredPatients = this.getPatientControl.valueChanges.pipe(
			startWith(''),
			map((filterValue: string) => this.patients.filter((option) => option.name.toLowerCase().includes(filterValue)))
		);
	}

	createSession() {
		if (this.createSessionForm.invalid) {
			return;
		}

		this.loading = true;
			if(this.getRecurrenceControl.value != null) {
			this._sessionService.createRecurringSession(this.createSessionForm.getRawValue() as CreateSessionFormValue).subscribe({
				complete: () => {
					this.loading = false;
					this._snackBarService.openSuccessSnackBar('Série criada com sucesso');
					this.closeDialog(true);
				},
				error: (error: HttpErrorResponse) => {
					this.loading = false;
					console.log(error);
					switch(error.status) {
						case HttpStatusCode.Forbidden:
							this._snackBarService.openErrorSnackBar('Não é possível criar sessões no passado');
							break;
						default:
							this._snackBarService.openErrorSnackBar('Erro a criar série');
							break;
					}
				}
			});
		} else {
			this._sessionService.createSession(this.createSessionForm.getRawValue() as CreateSessionFormValue).subscribe({
				complete: () => {
					this.loading = false;
					this._snackBarService.openSuccessSnackBar('Sessão criada com sucesso');
					this.closeDialog(true);
				},
				error: (error: HttpErrorResponse) => {
					this.loading = false;
					console.log(error);
					switch(error.status) {
						case HttpStatusCode.Forbidden:
							this._snackBarService.openErrorSnackBar('Não é possível criar sessões no passado');
							break;
						default:
							this._snackBarService.openErrorSnackBar('Erro a criar sessão');
							break;
					}
				}
			});
		}
	}

	editSession() {
		if (this.editSessionForm.invalid) {
			return;
		}

		this.loading = true;
		if (this.data.session?._id){
			this.loading = true;
			this._sessionService.editSession(this.editSessionForm.getRawValue() as EditSessionFormValue, this.data.session?._id).subscribe({
				complete: () => {
					this.loading = false;
					this._snackBarService.openSuccessSnackBar('Sessão editada com sucesso');
					this.closeDialog(true);
				},
				error: (error: HttpErrorResponse) => {
					this.loading = false;
					console.log(error);
					this._snackBarService.openErrorSnackBar('Erro a editar sessão');
				}
			});
		}

	}

	closeDialog(refresh?: boolean): void {
		this.dialogRef.close(refresh);
	}

	autocompleteDisplay(therapist: TherapistModel): string {
		return therapist?.name ? therapist.name : '';
	}

	get getDateControl(): FormControl {
		return this.data.session ? this.editSessionForm.get('date') as FormControl : this.createSessionForm.get('date') as FormControl;
	}
	get getTherapistControl(): FormControl {
		return this.data.session ? this.editSessionForm.get('therapist') as FormControl : this.createSessionForm.get('therapist') as FormControl;
	}
	get getDurationControl(): FormControl {
		return this.data.session ? this.editSessionForm.get('durationInMinutes') as FormControl : this.createSessionForm.get('durationInMinutes') as FormControl;
	}
	get getRecurrenceControl(): FormControl {
		return this.createSessionForm.get('recurrence') as FormControl;
	}
	get getVacanciesControl(): FormControl {
		return this.data.session ? this.editSessionForm.get('vacancies') as FormControl : this.createSessionForm.get('vacancies') as FormControl;
	}
	get getPatientControl(): FormControl {
		return this.editSessionForm.get('patient') as FormControl;
	}
	get getStatusControl(): FormControl {
		return this.editSessionForm.get('status') as FormControl;
	}
}
