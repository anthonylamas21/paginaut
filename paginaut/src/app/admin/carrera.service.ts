import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

export interface Carrera {
  id?: number;
  nombre_carrera: string;
  perfil_profesional?: string;
  ocupacion_profesional?: string;
  direccion_id: number;
  nivel_estudio_id: number;
  campo_estudio_id: number;
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

  saveCarrera(carrera: Carrera, imagenPrincipal?: File, imagenesGenerales?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre_carrera', carrera.nombre_carrera);
    formData.append('perfil_profesional', carrera.perfil_profesional || '');
    formData.append('ocupacion_profesional', carrera.ocupacion_profesional || '');
    formData.append('direccion_id', carrera.direccion_id.toString());
    formData.append('nivel_estudio_id', carrera.nivel_estudio_id.toString());
    formData.append('campo_estudio_id', carrera.campo_estudio_id.toString());
    formData.append('activo', carrera.activo ? 'true' : 'false');

    if (carrera.id) {
        formData.append('id', carrera.id.toString());
    }

    if (imagenPrincipal) {
        formData.append('imagen_principal', imagenPrincipal);
    }

    if (imagenesGenerales) {
        imagenesGenerales.forEach((file, index) => {
            formData.append(`imagenes_generales[${index}]`, file);
        });
    }

    return this.http
        .post<any>(this.apiUrl, formData)
        .pipe(
            catchError(this.handleError),
            tap(response => console.log("Respuesta del servidor:", response))
        );
}

getCuatrimestresYAsignaturas(carreraId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/cuatrimestres?carreraId=${carreraId}`);
}


  getCarreras(): Observable<CarreraResponse> {
    return this.http
      .get<CarreraResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  updateCarreraStatus(id: number, accion: string): Observable<any> {
    const params = new HttpParams().set('accion', accion);
    return this.http
      .put<any>(`${this.apiUrl}?id=${id}`, null, { params })
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
