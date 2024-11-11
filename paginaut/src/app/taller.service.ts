import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API } from './constans';

export interface Taller {
  id?: number;
  nombre: string;
  descripcion: string;
  competencia: string;
  imagen?: string;
  imagenesGenerales?: string[];
  activo: boolean;
}

export interface TallerResponse {
  records: Taller[];
}

@Injectable({
  providedIn: 'root'
})
export class TallerService {
  private apiUrl = API+'/api/taller.php'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) {}

  registrarTaller(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData).pipe(
      map(response => {
        if (response === null) {
          throw new Error('La respuesta del servidor es nula');
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  crearTaller(taller: Taller, imagenPrincipal?: File, imagenesGenerales?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', taller.nombre);
    formData.append('descripcion', taller.descripcion);
    formData.append('competencia', taller.competencia);

    if (imagenPrincipal) {
      formData.append('imagen_principal', imagenPrincipal);
    }

    if (imagenesGenerales) {
      imagenesGenerales.forEach((imagen, index) => {
        formData.append(`imagenes_generales[${index}]`, imagen);
      });
    }

    return this.http.post<any>(this.apiUrl, formData);
  }

  obtenerTalleres(): Observable<TallerResponse> {
    return this.http.get<TallerResponse>(this.apiUrl);
  }

  actualizarTaller(taller: Taller, imagenPrincipal?: File, imagenesGenerales?: File[], imagenesGeneralesActuales?: string[]): Observable<any> {
    const formData = new FormData();

    formData.append('id', taller.id!.toString());
    formData.append('nombre', taller.nombre);
    formData.append('descripcion', taller.descripcion);
    formData.append('competencia', taller.competencia);
    formData.append('activo', taller.activo.toString());

    if (imagenPrincipal) {
      formData.append('imagen_principal', imagenPrincipal, imagenPrincipal.name);
    }

    if (imagenesGenerales && imagenesGenerales.length > 0) {
      imagenesGenerales.forEach((imagen, index) => {
        formData.append(`imagenes_generales[${index}]`, imagen, imagen.name);
      });
    }

    if (imagenesGeneralesActuales) {
      formData.append('imagenes_generales_actuales', JSON.stringify(imagenesGeneralesActuales));
    }

    return this.http.put(`${this.apiUrl}?id=${taller.id}`, formData);
  }

  eliminarTaller(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    //console.error('Error detallado:', error);
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
