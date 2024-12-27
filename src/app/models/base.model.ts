export interface BaseModel {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface BaseResponse {
	message: string;
}