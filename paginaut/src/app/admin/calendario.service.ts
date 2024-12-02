import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API } from '../constans';

export interface Calendario {
  id?: number;
  titulo: string;
  archivo: string;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_string?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private apiUrl = API+'/api/calendario'; // Ajusta esta URL según tu configuración

  // Función constante para obtener encabezados con el token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; // Obtiene el token de LocalStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  constructor(private http: HttpClient) {}

  addCalendario(calendario: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, calendario)
      .pipe(catchError(this.handleError));
  }

  getCalendarios(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(catchError(this.handleError));
  }

  updateCalendario(calendario: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}`, calendario, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateCalendarioStatus(id: number, activo: boolean): Observable<any> {
    const body = { id, activo };
    return this.http
      .put<any>(this.apiUrl, body, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteCalendario(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ha ocurrido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de error
      errorMessage = `Código de error ${error.status}, mensaje: ${
        error.error.message || error.statusText
      }`;
    }
    //console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
