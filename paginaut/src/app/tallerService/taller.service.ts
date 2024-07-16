import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Taller {
  id?: number;
  nombre: string;
  descripcion: string;
  competencia: string;
  activo: boolean;
  fecha_publicacion: string;
  imagen_principal?: string;
  imagenes_generales?: string[];
  [key: string]: any; // Esto permite la indexación con strings
}

export interface TallerResponse {
  records: Taller[];
}

@Injectable({
  providedIn: 'root'
})
export class TallerService {
  private apiUrl = 'http://localhost/paginaut/api/taller';

  constructor(private http: HttpClient) {}

  crearTaller(taller: Taller, imagenPrincipal?: File, imagenesGenerales?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', taller.nombre);
    formData.append('competencia', taller.competencia);
    

    if (imagenPrincipal) {
      formData.append('imagen_principal', imagenPrincipal);
    }

    if (imagenesGenerales) {
      imagenesGenerales.forEach((imagen, index) => {
        formData.append(`imagenes_generales[${index}]`, imagen);
        formData.append('descripcion', taller.descripcion);
      });
    }

    return this.http.post<any>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  obtenerTaller(): Observable<TallerResponse> {
    return this.http.get<TallerResponse>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  actualizarTaller(taller: Taller, imagenPrincipal?: File, imagenesGenerales?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    
    Object.keys(taller).forEach(key => {
      if (taller[key] !== undefined && taller[key] !== null && key !== 'imagen_principal' && key !== 'imagenes_generales') {
        formData.append(key, taller[key].toString());
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

    return this.http.post(`${this.apiUrl}?id=${taller.id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  eliminarTaller(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  eliminarImagenGeneral(tallerId: number, rutaImagen: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?tallerId=${tallerId}&rutaImagen=${encodeURIComponent(rutaImagen)}`).pipe(
      catchError(this.handleError)
    );
  }

  desactivarTaller(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}&accion=desactivar`, {}).pipe(
      catchError(this.handleError)
    );
  }

  activarTaller(id: number): Observable<any> {
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
