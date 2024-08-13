import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Curso {
  id?: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fecha_publicacion: string;
  imagen_principal?: string;
  imagenes_generales?: string[];
  [key: string]: any; // Esto permite la indexación con strings
}

export interface CursoResponse {
  records: Curso[];
}

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://localhost/paginaut/api/curso';

  constructor(private http: HttpClient) {}

  crearCurso(curso: Curso, imagenPrincipal?: File, imagenesGenerales?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', curso.nombre);
    formData.append('descripcion', curso.descripcion);
    
    formData.append('activo', curso.activo.toString());

    if (imagenPrincipal) {
      formData.append('imagen_principal', imagenPrincipal);
    }

    if (imagenesGenerales) {
      imagenesGenerales.forEach((imagen, index) => {
        formData.append(`imagenes_generales[${index}]`, imagen);
        formData.append('resumen', curso.descripcion);
      });
    }

    return this.http.post<any>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  obtenerCurso(): Observable<CursoResponse> {
    return this.http.get<CursoResponse>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  obtenerCursoPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  actualizarCurso(curso: Curso, imagenPrincipal?: File, imagenesGenerales?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    
    Object.keys(curso).forEach(key => {
      if (curso[key] !== undefined && curso[key] !== null && key !== 'imagen_principal' && key !== 'imagenes_generales') {
        formData.append(key, curso[key].toString());
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

    return this.http.post(`${this.apiUrl}?id=${curso.id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  eliminarCurso(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  eliminarImagenGeneral(cursoId: number, rutaImagen: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?cursoId=${cursoId}&rutaImagen=${encodeURIComponent(rutaImagen)}`).pipe(
      catchError(this.handleError)
    );
  }

  desactivarCurso(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}&accion=desactivar`, {}).pipe(
      catchError(this.handleError)
    );
  }

  activarCurso(id: number): Observable<any> {
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
