import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Carrera {
  id?: number;
  nombre_carrera: string;
  perfil_profesional?: string;
  ocupacion_profesional?: string;
  direccion_id?: number;
  activo?: boolean;
  fecha_creacion?: string;
  imagenes?: Imagen[];
}

export interface Imagen {
  id?: number;
  titulo: string;
  descripcion?: string;
  ruta_imagen: string;
  seccion: string;
  asociado_id: number;
  principal?: boolean;
  fecha_creacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarrerasService {
  private apiUrl = 'http://localhost/paginaut/api/carrera.php';

  constructor(private http: HttpClient) {}

  agregarCarrera(carrera: Carrera): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, carrera)
      .pipe(catchError(this.handleError));
  }

  obtenerCarreras(): Observable<Carrera[]> {
    return this.http
      .get<Carrera[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerCarrera(id: number): Observable<Carrera> {
    return this.http
      .get<Carrera>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  actualizarCarrera(carrera: Carrera): Observable<any> {
    return this.http
      .put<any>(this.apiUrl, carrera)
      .pipe(catchError(this.handleError));
  }

  eliminarCarrera(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  subirImagen(formData: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}?accion=uploadImage`, formData)
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
