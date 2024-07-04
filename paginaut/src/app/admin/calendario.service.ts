import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Calendario {
  id?: number;
  titulo: string;
  archivo: string;
  activo?: boolean;
  fecha_creacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private apiUrl = 'http://localhost/paginaut/api/calendario.php'; // Ajusta esta URL según tu configuración

  constructor(private http: HttpClient) {}

  addCalendario(calendario: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, calendario)
      .pipe(catchError(this.handleError));
  }

  getCalendarios(): Observable<Calendario[]> {
    return this.http
      .get<Calendario[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  updateCalendario(calendario: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}`, calendario)
      .pipe(catchError(this.handleError));
  }

  updateCalendarioStatus(id: number, status: boolean): Observable<any> {
    const body = { id, status };
    return this.http
      .put<any>(`${this.apiUrl}/status`, body)
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
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
