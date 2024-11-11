import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Profesor {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  especialidad?: string;
  grado_academico?: string;
  experiencia?: string;
  foto?: string;
  activo?: boolean;
  fecha_creacion?: string;
}

export interface TipoProfesor {
  id?: number;
  profesor_id: number;
  tipo_id: number;
}

export interface ProfesorResponse {
  records: Profesor[];
}

@Injectable({
  providedIn: 'root',
})
export class ProfesorService {
  private apiUrl = 'http://localhost/paginaut/api/profesor';
  private tipoUrl = 'http://localhost/paginaut/api/tipo-pro';

  constructor(private http: HttpClient) {}

  addProfesor(profesor: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, profesor)
      .pipe(catchError(this.handleError));
  }

  getProfesores(): Observable<ProfesorResponse> {
    return this.http
      .get<ProfesorResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getProfesorById(id: number): Observable<Profesor> {
    return this.http
      .get<Profesor>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  updateProfesor(profesor: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, profesor) // Usando POST para la actualización
      .pipe(catchError(this.handleError));
  }

  deleteProfesor(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  // TIPOS DE PROFESORES
  getTiposProfesor(profesor_id: number): Observable<TipoProfesor[]> {
    return this.http
      .get<TipoProfesor[]>(`${this.tipoUrl}?profesor_id=${profesor_id}`)
      .pipe(catchError(this.handleError));
  }

  addTipoProfesor(tiposProfesor: TipoProfesor[]): Observable<any> {
    return this.http
      .post<any>(this.tipoUrl, tiposProfesor)
      .pipe(catchError(this.handleError));
  }

  deleteTiposByProfesorId(profesor_id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.tipoUrl}?profesor_id=${profesor_id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ha ocurrido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status !== 200) {
      // El backend retornó un código de estado diferente de 200
      errorMessage = `Código de error ${error.status}, mensaje: ${
        error.error.message || error.statusText
      }`;
    }

    //console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
