import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Direccion {
  id?: number;
  abreviatura: string;
  nombre: string;
  activo?: boolean;
  fecha_creacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private apiUrl = 'http://localhost/paginaut/api/direccion.php'; // Ajusta esta URL según tu configuración

  constructor(private http: HttpClient) {}

  agregarDireccion(direccion: Direccion): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, direccion)
      .pipe(catchError(this.handleError));
  }

  obtenerDirecciones(): Observable<Direccion[]> {
    return this.http
      .get<Direccion[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerDireccion(id: number): Observable<Direccion> {
    return this.http
      .get<Direccion>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  actualizarDireccion(direccion: Direccion): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}`, direccion)
      .pipe(catchError(this.handleError));
  }

  eliminarDireccion(id: number): Observable<any> {
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
