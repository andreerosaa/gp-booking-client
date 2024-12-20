import { BaseModel } from './base.model';

export interface UserModel extends BaseModel {
	username: string;
	password?: string;
}

export interface LoginUserRequest {
	username: string;
	password: string;
}
export interface LoginUserResponse {
	accessToken: string;
}