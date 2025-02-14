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

export interface LoginUnverifiedUserResponse {
	userId: string;
	email: string;
	password: string;
}

export interface RegisterUserRequest extends LoginUserRequest {
	name: string;
	surname: string;
}

export interface RegisterForm extends LoginForm {
	passwordConfirmation: FormControl<string | null>;
	name: FormControl<string | null>;
	surname: FormControl<string | null>;
	terms: FormControl<boolean | null>;
}

export interface RegisterUserResponse {
	id: string;
	email: string;
}

export interface VerificationForm {
	code: FormControl<string | null>;
}

export interface VerifyUserRequest {
	verificationCode: number;
}