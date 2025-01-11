import { FormControl } from '@angular/forms';
import { BaseIdentification, BaseModel, IdentificationWithEmail } from './base.model';
import { TemplateModel } from './template.model';

export interface SessionModel extends BaseModel {
	date: Date;
	therapistId: string;
	patientId: string;
	durationInMinutes: number;
	vacancies: number;
	status: SessionStatusEnum;
	confirmationToken: string;
	cancelationToken: string;
	seriesId?: string;
}
export interface SessionByDateModel extends BaseModel {
	date: Date;
	therapist: BaseIdentification;
	patient?: IdentificationWithEmail;
	durationInMinutes: number;
	vacancies: number;
	status: SessionStatusEnum;
	confirmationToken: string;
	cancelationToken: string;
	seriesId?: string;
}

export enum SessionStatusEnum {
	AVAILABLE,
	PENDING,
	CONFIRMED,
	COMPLETED,
	CANCELED
}

export const SessionStatusMessages: { [key in SessionStatusEnum]: string } = {
	[SessionStatusEnum.AVAILABLE]: 'Disponível',
	[SessionStatusEnum.PENDING]: 'Pendente',
	[SessionStatusEnum.CONFIRMED]: 'Confirmada',
	[SessionStatusEnum.COMPLETED]: 'Concluída',
	[SessionStatusEnum.CANCELED]: 'Cancelada'
};

export interface SessionBookingDialogData {
	session: SessionModel;
}

export interface SessionBookingForm {
	name: FormControl<string | null>;
	email: FormControl<string | null>;
	terms: FormControl<boolean | null>;
}

export interface VerificationForm {
	code: FormControl<string | null>;
}

export interface BookSessionRequestModel {
	patientName: string;
	email: string;
}

export interface BookSessionResponse {
	session: SessionModel;
	newPatient: boolean;
}

export interface CreateEditSessionRequestModel {
	date: Date;
	therapistId: string;
	durationInMinutes: number;
	vacancies: number;
	recurrence?: SessionRecurrenceEnum;
	status: SessionStatusEnum;
}

export interface SessionByDateRequestModel {
	date: Date;
}

export interface CreateSessionForm {
	date: FormControl<Date | null>;
	therapist: FormControl<BaseIdentification | null>;
	durationInMinutes: FormControl<number | null>;
	recurrence?: FormControl<SessionRecurrenceEnum | null>;
	vacancies: FormControl<number | null>;
}
export interface CreateSessionFormValue {
	date: Date;
	therapist: BaseIdentification;
	durationInMinutes: number;
	recurrence?: SessionRecurrenceEnum;
	vacancies: number;
}

export interface EditSessionForm extends CreateSessionForm {
	status: FormControl<SessionStatusEnum | null>;
	patient: FormControl<IdentificationWithEmail | null>;
}
export interface EditSessionFormValue extends CreateSessionFormValue {
	status: SessionStatusEnum;
	patient: IdentificationWithEmail;
}
export interface CreateEditSessionDialogData {
	date: Date;
	session?: SessionByDateModel;
}
export interface CreateFromTemplateDialogData {
	date: Date;
}

export interface CreateFromTemplateForm {
	template: FormControl<TemplateModel | null>;
}
export interface CreateFromTemplateFormValue {
	template: TemplateModel;
}

export interface CreateFromTemplateRequestModel {
	date: Date;
	templateId: string;
}

export interface ClearDayRequestModel {
	date: Date;
}

export enum SessionRecurrenceEnum {
	DAILY,
	WEEKDAYS,
	WEEKLY,
	MONTHLY
}

export const SessionRecurrenceMessages: { [key in SessionRecurrenceEnum]: string } = {
	[SessionRecurrenceEnum.DAILY]: 'Todos os dias',
	[SessionRecurrenceEnum.WEEKDAYS]: 'Todos os dias de semana',
	[SessionRecurrenceEnum.WEEKLY]: 'Todas as semanas',
	[SessionRecurrenceEnum.MONTHLY]: 'Todos os meses',
};