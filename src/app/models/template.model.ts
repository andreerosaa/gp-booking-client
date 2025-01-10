import { FormControl } from '@angular/forms';
import { BaseIdentification, BaseModel } from './base.model';

export interface TemplateModel extends BaseModel {
	name: string;
	startTimes: Date[];
	therapistId: string;
	durationInMinutes: number;
	vacancies: number;
}

export interface CreateTemplateRequest {
	name: string;
	startTimes: Date[];
	therapistId: string;
	durationInMinutes: number;
	vacancies: number;
}

export interface CreateTemplateForm {
    name : FormControl<string | null>
    startTimes : FormControl<string[] | null>
    therapist : FormControl<BaseIdentification | null>
    durationInMinutes : FormControl<number | null>
    vacancies : FormControl<number | null>    
}

export interface CreateTemplateFormValue {
	name: string;
	startTimes: string[];
	therapist: BaseIdentification;
	durationInMinutes: number;
	vacancies: number;
}

export interface CreateEditTemplateDialogData {
	template?: TemplateModel;
}

export interface EditTemplateForm {
    name : FormControl<string | null>
    startTimes : FormControl<Date[] | null>
    therapist : FormControl<BaseIdentification | null>
    durationInMinutes : FormControl<number | null>
    vacancies : FormControl<number | null>    
}