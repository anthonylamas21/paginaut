import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CampoEstudio {
  id?: number;
  campo: string;
  activo?: boolean;
  fecha_creacion?: string;
}

export interface CampoEstudioResponse {
  records: CampoEstudio[];
}

@Injectable({
  providedIn: 'root',
})
export class CampoEstudioService {
  private apiUrl = 'http://localhost/paginaut/api/campo-estudio.php';

  constructor(private http: HttpClient) {}

  saveCampoEstudio(campoEstudio: CampoEstudio): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, campoEstudio)
      .pipe(catchError(this.handleError));
  }

  getCampoEstudio(): Observable<CampoEstudioResponse> {
    return this.http
      .get<CampoEstudioResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  updateCampoEstudioStatus(id: number, activo: boolean): Observable<any> {
    const body = { id, activo };
    return this.http
      .put<any>(this.apiUrl, body)
      .pipe(catchError(this.handleError));
  }

  deleteCampoEstudio(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ha ocurrido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error ${error.status}, mensaje: ${
        error.error.message || error.statusText
      }`;
    }
     //console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
