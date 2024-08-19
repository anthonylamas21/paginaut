import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Requisito {
  id?: number;
  id_bolsadetrabajo: number;
  requisito: string;
}

export interface BolsaDeTrabajo {
  id?: number;
  nombre_empresa: string;
  descripcion_trabajo: string;
  puesto_trabajo: string;
  direccion: string;
  telefono: string;
  correo: string;
  activo?: boolean;
  fecha_creacion?: string;
  requisitos: Requisito[];
}

export interface BolsaDeTrabajoResponse {
  records: BolsaDeTrabajo[];
}

@Injectable({
  providedIn: 'root',
})
export class BolsaDeTrabajoService {
  private apiUrl = 'http://localhost/paginaut/api/bolsa_de_trabajo.php';

  constructor(private http: HttpClient) {}

  addBolsa(bolsa: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, bolsa)
      .pipe(catchError(this.handleError));
  }

  addRequisitos(requisitos: Requisito[]): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/requisitos`, { requisitos })
      .pipe(catchError(this.handleError));
  }

  getBolsas(): Observable<BolsaDeTrabajoResponse> {
    return this.http
      .get<BolsaDeTrabajoResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getBolsaById(id: number): Observable<BolsaDeTrabajo> {
    return this.http
      .get<BolsaDeTrabajo>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  updateBolsa(id: number, bolsa: any): Observable<any> {
    const body = { id, ...bolsa };
    return this.http
      .put<any>(this.apiUrl, body)
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
