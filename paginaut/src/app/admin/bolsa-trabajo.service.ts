import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Bolsa {
  id?: number;
  nombre_empresa: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  correo: string;
  puesto: string;
  horarios: any[];
  requisitos: any[];
  archivo: string;
  activo?: boolean;
  fecha_creacion?: string;
  id_direccion?: number;
}

export interface BolsaResponse {
  records: Bolsa[];
}

@Injectable({
  providedIn: 'root',
})
export class BolsaTrabajoService {
  private apiUrl = 'http://localhost/paginaut/api/bolsa_de_trabajo.php';

  constructor(private http: HttpClient) {}

  addBolsa(bolsa: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, bolsa)
      .pipe(catchError(this.handleError));
  }

  getBolsas(): Observable<BolsaResponse> {
    return this.http
      .get<BolsaResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getBolsaById(id: number): Observable<Bolsa> {
    return this.http
      .get<Bolsa>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  updateBolsa(bolsa: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, bolsa)
      .pipe(catchError(this.handleError));
  }

  updateBolsaStatus(id: number, activo: boolean): Observable<any> {
    const body = { id, activo };
    return this.http
      .put<any>(this.apiUrl, body)
      .pipe(catchError(this.handleError));
  }

  deleteBolsa(id: number): Observable<any> {
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
