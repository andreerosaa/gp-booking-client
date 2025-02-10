import { FormControl } from '@angular/forms';
import { BaseModel } from './base.model';

export interface UserModel extends BaseModel {
	name: string;
	surname: string;
	email: string;
	verified: boolean;
	verificationCode: number;
	expirationCode: Date;
	password?: string;
	role: RoleEnum;
}

export enum RoleEnum {
	ADMIN = 'admin',
	PATIENT = 'patient'
}

export interface LoginUserRequest {
	email: string;
	password: string;
}

export interface LoginForm {
	email: FormControl<string | null>;
	password: FormControl<string | null>;
}

export interface LoginUserResponse {
	accessToken: string;
}