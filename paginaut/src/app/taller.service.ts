import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TallerService {
  private apiUrl = 'http://localhost/paginaut/api/taller.php'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) { }

  registrarTaller(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData).pipe(
      tap(response => console.log('Respuesta completa del servidor:', response)),
      map(response => {
        if (response === null) {
          throw new Error('La respuesta del servidor es nula');
        }
        return response;
      }),
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
