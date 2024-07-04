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
  private apiUrl = 'http://localhost/paginaut/api/calendario.php';

  constructor(private http: HttpClient) {}

  agregarCalendario(calendario: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, calendario)
      .pipe(catchError(this.handleError));
  }

  obtenerCalendarios(): Observable<Calendario[]> {
    return this.http
      .get<Calendario[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  actualizarCalendario(calendario: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, calendario)
      .pipe(catchError(this.handleError));
  }

  eliminarCalendario(id: number): Observable<any> {
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
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}