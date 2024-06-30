import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface Taller {
  id?: number;
  nombre: string;
  descripcion: string;
  competencia: string;
  imagen?: File | string;
}

@Injectable({
  providedIn: 'root'
})
export class TallerService {
  private apiUrl = 'http://localhost/paginaut/api/taller.php'; // Adjust this URL to match your setup

  constructor(private http: HttpClient) { }

  crearTaller(taller: Taller, imagenPrincipal?: File, imagenesGenerales?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', taller.nombre);
    formData.append('descripcion', taller.descripcion);
    formData.append('competencia', taller.competencia);

    if (imagenPrincipal) {
      formData.append('imagen_principal', imagenPrincipal);
    }

    if (imagenesGenerales && imagenesGenerales.length > 0) {
      imagenesGenerales.forEach((imagen, index) => {
        formData.append(`imagenes_generales[${index}]`, imagen);
      });
    }

    return this.http.post<any>(this.apiUrl, formData);
  }


  obtenerTalleres(): Observable<Taller[]> {
    return this.http.get<Taller[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  obtenerTaller(id: number): Observable<Taller> {
    return this.http.get<Taller>(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  actualizarTaller(taller: Taller, imagen?: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', taller.id!.toString());
    formData.append('nombre', taller.nombre);
    formData.append('descripcion', taller.descripcion);
    formData.append('competencia', taller.competencia);
    if (imagen) {
      formData.append('imagen', imagen, imagen.name);
    }

    return this.http.post(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  eliminarTaller(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error detallado:', error);
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet y la URL del servidor.';
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error?.message || error.statusText}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
