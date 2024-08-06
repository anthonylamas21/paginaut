import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
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

  saveCarrera(carrera: Carrera): Observable<any> {
    const formData = new HttpParams()
      .set('id', carrera.id?.toString() || '')
      .set('nombre_carrera', carrera.nombre_carrera)
      .set('perfil_profesional', carrera.perfil_profesional || '')
      .set('ocupacion_profesional', carrera.ocupacion_profesional || '')
      .set('direccion_id', carrera.direccion_id.toString())
      .set('activo', carrera.activo ? '1' : '0');

    return this.http
      .post<any>(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  getCarreras(): Observable<CarreraResponse> {
    return this.http
      .get<CarreraResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  updateCarreraStatus(id: number, activo: boolean): Observable<any> {
    const body = { id, activo };
    return this.http
      .put<any>(`${this.apiUrl}`, body)
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
