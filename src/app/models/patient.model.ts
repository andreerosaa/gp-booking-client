import { BaseModel } from './base.model';

export interface PatientModel extends BaseModel {
	name: string;
	email: string;
}

export interface VerifyPatientRequest {
	verificationCode: number;
}

export interface GetPatientByEmailRequest {
	email: string;
}
