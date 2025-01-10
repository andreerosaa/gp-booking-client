import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, of, timestamp } from 'rxjs';
import { CreateTemplateFormValue, CreateTemplateRequest, TemplateModel } from '../../models/template.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseResponse } from '../../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = `${environment.API_BASE_URL}/template`;

  getTemplates(): Observable<TemplateModel[]> {

    return this._http.get<TemplateModel[]>(`${this._apiUrl}`).pipe(takeUntilDestroyed(this._destroyRef));
  }

  createTemplate(createTemplateForm: CreateTemplateFormValue): Observable<TemplateModel> {   
    const request: CreateTemplateRequest = {
      name: createTemplateForm.name,
      startTimes: createTemplateForm.startTimes.map((timeString) => {
        const now = new Date();
        const [hours, minutes] = timeString.split(':').map(Number);   
        now.setHours(hours, minutes, 0);
        if (now instanceof Date && !isNaN(now.getTime())) {
          return now;
        } else {
          return;
        }
      }).filter((date) => date !== undefined),
      therapistId: createTemplateForm.therapist.id,
      durationInMinutes: createTemplateForm.durationInMinutes,
      vacancies: createTemplateForm.vacancies,
    }

    return this._http.post<TemplateModel>(`${this._apiUrl}`, request).pipe(takeUntilDestroyed(this._destroyRef));
  }

  deleteTemplate(templateId: string): Observable<BaseResponse> {

    return this._http.delete<BaseResponse>(`${this._apiUrl}/delete/${templateId}`).pipe(takeUntilDestroyed(this._destroyRef));
  }
}
