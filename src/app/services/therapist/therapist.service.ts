import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { TherapistModel } from '../../models/therapist.model';

@Injectable({
  providedIn: 'root'
})
export class TherapistService {

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = `${environment.API_BASE_URL}/therapist`;

  getTherapists(): Observable<TherapistModel[]> {

    return this._http.get<TherapistModel[]>(this._apiUrl).pipe(takeUntilDestroyed(this._destroyRef));
  }
}
