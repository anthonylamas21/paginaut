import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Carrera {
  id?: number;
  nombre_carrera: string;
  perfil_profesional?: string;
  ocupacion_profesional?: string;
  direccion_id: number;
  activo?: boolean;
  fecha_creacion?: string;
}

export interface CarreraResponse {
  records: Carrera[];
}

@Injectable({
  providedIn: 'root',
})
export class CarreraService {
  private apiUrl = 'http://localhost/paginaut/api/carrera.php';

  constructor(private http: HttpClient) {}

  addCarrera(carrera: Carrera): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, carrera)
      .pipe(catchError(this.handleError));
  }

  getCarreras(): Observable<CarreraResponse> {
    return this.http
      .get<CarreraResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getCarreraById(id: number): Observable<Carrera> {
    return this.http
      .get<Carrera>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  updateCarrera(carrera: Carrera): Observable<any> {
    return this.http
      .put<any>(this.apiUrl, carrera)
      .pipe(catchError(this.handleError));
  }

  updateCarreraStatus(id: number, activo: boolean): Observable<any> {
    const body = { id, activo };
    return this.http
      .put<any>(`${this.apiUrl}/status`, body)
      .pipe(catchError(this.handleError));
  }

  deleteCarrera(id: number): Observable<any> {
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
