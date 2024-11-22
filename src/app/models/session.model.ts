import { BaseModel } from './base.model';

export interface SessionModel extends BaseModel {
	date: Date;
	therapistId: string;
	patientId: string;
	durationInMinutes: number;
	vacancies: number;
	status: SessionStatusEnum;
	confirmationToken: string;
}

export enum SessionStatusEnum {
	PENDING,
	CONFIRMED,
	COMPLETED,
	CANCELED
}

export const SessionStatusMessages: { [key in SessionStatusEnum]: string } = {
    [SessionStatusEnum.PENDING]: 'Pendente',
    [SessionStatusEnum.CONFIRMED]: 'Confirmada',
    [SessionStatusEnum.COMPLETED]: 'Concluída',
    [SessionStatusEnum.CANCELED]: 'Cancelada',
};

export interface SessionBookingDialogData {
	session: SessionModel;
  }