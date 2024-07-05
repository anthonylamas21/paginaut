import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Rol{
  id?: number;
  nombre: string;
  activo?: boolean;
  fecha_creacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = 'http://localhost/paginaut/api/rol.php';

  constructor(private clientService: HttpClient) { }

  agregarRol(rol: Rol): Observable<any> {
    return this.clientService.post<any>(this.apiUrl, rol).pipe(
      catchError(this.handleError)
    );
  }

  obtenerRoles(): Observable<any>{
    return this.clientService.get<any>(this.apiUrl).pipe(
      catchError(this.handleError));
  }

  obtenerRol(id: number): Observable<Rol> {
    return this.clientService
      .get<Rol>(`${this.apiUrl}?id=${id}`).pipe(
        catchError(this.handleError));
  }

  actualizarRol(direccion: Rol): Observable<any> {
    return this.clientService.put<any>(`${this.apiUrl}`, direccion).pipe(
      catchError(this.handleError));
  }

  eliminarRol(id: number): Observable<any> {
    return this.clientService.delete<any>(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ha ocurrido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de error
      errorMessage = `Código de error ${error.status}, ` +
                     `mensaje: ${error.error.message || error.statusText}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
