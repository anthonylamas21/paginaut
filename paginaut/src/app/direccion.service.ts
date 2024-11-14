import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API } from './constans';

export interface Direccion {
  id?: number;
  abreviatura: string;
  nombre: string;
  activo?: boolean;
  fecha_creacion?: string;
}

export interface DireccionResponse {
  records: Direccion[];
}

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private apiUrl = API+'/api/direccion.php';

  constructor(private http: HttpClient) {}

  addDireccion(direccion: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, direccion)
      .pipe(catchError(this.handleError));
  }

  getDirecciones(): Observable<DireccionResponse> {
    return this.http
      .get<DireccionResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getDireccionById(id: number): Observable<Direccion> {
    return this.http
      .get<Direccion>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  updateDireccion(direccion: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, direccion)
      .pipe(catchError(this.handleError));
  }

  updateDireccionStatus(id: number, activo: boolean): Observable<any> {
    const body = { id, activo };
    return this.http
      .put<any>(this.apiUrl, body)
      .pipe(catchError(this.handleError));
  }

  deleteDireccion(id: number): Observable<any> {
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
