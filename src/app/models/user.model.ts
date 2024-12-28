import { FormControl } from '@angular/forms';
import { BaseModel } from './base.model';

export interface UserModel extends BaseModel {
	username: string;
	password?: string;
}

export interface LoginUserRequest {
	username: string;
	password: string;
}

export interface LoginForm {
	username: FormControl<string | null>;
	password: FormControl<string | null>;
}

export interface LoginUserResponse {
	accessToken: string;
}