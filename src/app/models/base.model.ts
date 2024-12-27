export interface BaseModel {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface BaseResponse {
	message: string;
}

export interface ConfirmationDialogData {
	title: string;
	message: string;
}