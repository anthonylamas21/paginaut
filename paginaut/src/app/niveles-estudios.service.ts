import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API } from './constans';

export interface NivelesEstudios {
  id?: number;
  nivel: string;
  activo?: boolean;
  fecha_creacion?: string;
}

export interface NivelesEstudiosResponse {
  records: NivelesEstudios[];
}

@Injectable({
  providedIn: 'root',
})
export class NivelesEstudiosService {
  private apiUrl = API+'/api/niveles-estudios.php';

  constructor(private http: HttpClient) {}

  saveNivelesEstudios(nivelesEstudios: NivelesEstudios): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, nivelesEstudios)
      .pipe(catchError(this.handleError));
  }

  getNivelesEstudios(): Observable<NivelesEstudiosResponse> {
    return this.http
      .get<NivelesEstudiosResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  updateNivelesEstudiosStatus(id: number, activo: boolean): Observable<any> {
    const body = { id, activo };
    return this.http
      .put<any>(this.apiUrl, body)
      .pipe(catchError(this.handleError));
  }

  deleteNivelesEstudios(id: number): Observable<any> {
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
