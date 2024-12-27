import { BaseModel } from './base.model';

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
	therapist: { id: string; name: string };
	patient?: {id: string; name: string, email: string};
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
