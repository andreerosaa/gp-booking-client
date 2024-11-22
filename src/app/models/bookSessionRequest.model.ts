import { SessionModel } from "./session.model";

export interface BookSessionRequestModel {
	patientName: string;
	email: string;
}

export interface BookSessionResponse {
	session: SessionModel;
	newPatient: boolean;
}