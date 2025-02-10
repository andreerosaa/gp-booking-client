import { FormControl } from '@angular/forms';
import { BaseIdentification, BaseModel, IdentificationWithEmail } from './base.model';
import { TemplateModel } from './template.model';

export interface SessionModel extends BaseModel {
	date: Date;
	therapistId: string;
	userId: string;
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
	user?: IdentificationWithEmail;
	durationInMinutes: number;
	vacancies: number;
	status: SessionStatusEnum;
	confirmationToken: string;
	cancelationToken: string;
	seriesId?: string;
}

export enum SessionStatusEnum {
	AVAILABLE = 'available',
	PENDING = 'pending',
	CONFIRMED = 'confirmed',
	COMPLETED = 'completed',
	CANCELED = 'canceled'
}

export const SessionStatusMessages: { [key in SessionStatusEnum]: string } = {
	[SessionStatusEnum.AVAILABLE]: 'Disponível',
	[SessionStatusEnum.PENDING]: 'Pendente',
	[SessionStatusEnum.CONFIRMED]: 'Confirmada',
	[SessionStatusEnum.COMPLETED]: 'Concluída',
	[SessionStatusEnum.CANCELED]: 'Cancelada'
};

export enum DayStatusEnum {
	AVAILABLE,
	PENDING,
	FULL,
	NONE
}

export const DayStatusMap = new Map<DayStatusEnum, { dateClass: string, toolTip: string}>([
	[DayStatusEnum.AVAILABLE, {dateClass: 'day-available', toolTip: 'Pelo menos 1 sessão disponível'}],
	[DayStatusEnum.PENDING, {dateClass: 'day-pending', toolTip: 'Pelo menos 1 sessão a aguardar confirmação'}],
	[DayStatusEnum.FULL, {dateClass: 'day-full', toolTip: 'Sem sessões disponíveis'}],
	[DayStatusEnum.NONE, {dateClass: '', toolTip: ''}]
])

export interface SessionBookingDialogData {
	session: SessionModel;
}

export interface SessionBookingForm {
	name: FormControl<string | null>;
	email: FormControl<string | null>;
	terms: FormControl<boolean | null>;
}

export interface AdminBookingForm {
	user: FormControl<IdentificationWithEmail | null>;
}

export interface VerificationForm {
	code: FormControl<string | null>;
}

export interface BookSessionRequestModel {
	email: string;
}

export interface BookSessionResponse {
	session: SessionModel;
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
	user: FormControl<IdentificationWithEmail | null>;
}
export interface EditSessionFormValue extends CreateSessionFormValue {
	status: SessionStatusEnum;
	user: IdentificationWithEmail;
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

export interface GetDayStatusByMonthRequestModel {
	month: number;
	year: number;
}

export interface DayStatusByMonth {
	available: Date[]; //at least one available
	pending: Date[]; //at least one pending
	full: Date[]; //none available
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
	[SessionRecurrenceEnum.MONTHLY]: 'Todos os meses'
};
