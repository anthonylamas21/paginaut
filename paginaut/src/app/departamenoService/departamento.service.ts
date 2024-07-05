import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';


export interface Departamento{
  id?: number;
  nombre: string;
  activo?: boolean;
  fecha_creacion?: string;
}
@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private apiUrl = 'http://localhost/paginaut/api/departamento.php';

  constructor(private clientService: HttpClient) { }

  agregarDepartamento(departamento: Departamento): Observable<any> {
    return this.clientService.post<any>(this.apiUrl, departamento).pipe(
      catchError(this.handleError)
    );
  }

  obtenerDepartamentos(): Observable<any>{
    return this.clientService.get<any>(this.apiUrl).pipe(
      catchError(this.handleError));
  }

  obtenerDepartamento(id: number): Observable<Departamento> {
    return this.clientService
      .get<Departamento>(`${this.apiUrl}?id=${id}`).pipe(
        catchError(this.handleError));
  }

  actualizarDepartamento(direccion: Departamento): Observable<any> {
    return this.clientService.put<any>(`${this.apiUrl}`, direccion).pipe(
      catchError(this.handleError));
  }

  eliminarDepartamento(id: number): Observable<any> {
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

