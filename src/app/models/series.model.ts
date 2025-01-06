import { BaseModel } from "./base.model";
import { SessionRecurrenceEnum } from "./session.model";

export interface SeriesModel extends BaseModel {
    recurrence: SessionRecurrenceEnum;
    startDate: Date;
    endDate: Date;
}