import { FormControl } from '@angular/forms';
import { BaseIdentification, BaseModel, IdentificationWithEmail } from './base.model';
import { TherapistModel } from './therapist.model';

export interface SessionModel extends BaseModel {
	date: Date;
	therapistId: string;
	patientId: string;
	durationInMinutes: number;
	vacancies: number;
	status: SessionStatusEnum;
	confirmationToken: string;
	cancelationToken: string;
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

export interface CreateSessionRequestModel {
	date: Date;
	therapistId: string;
	durationInMinutes: number;
	vacancies: number;
	status: SessionStatusEnum;
}

export interface SessionByDateRequestModel {
	date: Date;
}

export interface CreateSessionForm {
	date: FormControl<Date | null>;
	therapist: FormControl<TherapistModel | null>;
	durationInMinutes: FormControl<number | null>;
	vacancies: FormControl<number | null>;
}
export interface CreateSessionFormValue {
	date: Date;
	therapist: TherapistModel;
	durationInMinutes: number;
	vacancies: number;
}
export interface CreateEditSessionDialogData {
	date: Date;
	session?: SessionByDateModel;
}
