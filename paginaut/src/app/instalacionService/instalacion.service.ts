import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Instalacion {
  id?: number;
  nombre: string;
  resumen: string;
  activo: boolean;
  fecha_publicacion: string;
  imagen_principal?: string;
  imagenes_generales?: string[];
  [key: string]: any; // Esto permite la indexación con strings
}

export interface InstalacionResponse {
  records: Instalacion[];
}

@Injectable({
  providedIn: 'root'
})
export class InstalacionService {
  private apiUrl = 'http://localhost/paginaut/api/instalacion';

  constructor(private http: HttpClient) {}

  crearInstalacion(instalacion: Instalacion, imagenPrincipal?: File, imagenesGenerales?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', instalacion.nombre);
    
    formData.append('activo', instalacion.activo.toString());

    if (imagenPrincipal) {
      formData.append('imagen_principal', imagenPrincipal);
    }

    if (imagenesGenerales) {
      imagenesGenerales.forEach((imagen, index) => {
        formData.append(`imagenes_generales[${index}]`, imagen);
        formData.append('resumen', instalacion.resumen);
      });
    }

    return this.http.post<any>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  obtenerInstalacion(): Observable<InstalacionResponse> {
    return this.http.get<InstalacionResponse>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  obtenerInstalacionPorId(id: number): Observable<Instalacion> {
    return this.http.get<Instalacion>(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  actualizarInstalacion(instalacion: Instalacion, imagenPrincipal?: File, imagenesGenerales?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    
    Object.keys(instalacion).forEach(key => {
      if (instalacion[key] !== undefined && instalacion[key] !== null && key !== 'imagen_principal' && key !== 'imagenes_generales') {
        formData.append(key, instalacion[key].toString());
      }
    });

    if (imagenPrincipal) {
      formData.append('imagen_principal', imagenPrincipal, imagenPrincipal.name);
    }

    if (imagenesGenerales && imagenesGenerales.length > 0) {
      imagenesGenerales.forEach((imagen, index) => {
        formData.append(`imagenes_generales[]`, imagen, imagen.name);
      });
    }

    return this.http.post(`${this.apiUrl}?id=${instalacion.id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  eliminarInstalacion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  eliminarImagenGeneral(instalacionId: number, rutaImagen: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?instalacionId=${instalacionId}&rutaImagen=${encodeURIComponent(rutaImagen)}`).pipe(
      catchError(this.handleError)
    );
  }

  desactivarInstalacion(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}&accion=desactivar`, {}).pipe(
      catchError(this.handleError)
    );
  }

  activarInstalacion(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}&accion=activar`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
