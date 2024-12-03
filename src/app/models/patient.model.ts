import { BaseModel } from './base.model';

export interface PatientModel extends BaseModel {
	name: string;
	email: string;
	verified: boolean;
	verificationCode?: number;
	expirationCode?: number;
}

export interface CreatePatientRequest {
	name: string;
	email: string;
	verified: boolean;
}

export interface UpdatePatientNameRequest {
	name: string;
	email: string;
}

export interface VerifyPatientRequest {
	verificationCode: number;
}

export interface GetPatientByEmailRequest {
	email: string;
}
