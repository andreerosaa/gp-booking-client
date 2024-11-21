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
