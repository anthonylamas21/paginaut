import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API } from '../constans';

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
  private apiUrl = API+'/api/bolsa_de_trabajo';
  private apiUrlRequisitos = API+'/api/bolsa_requisitos';

  constructor(private http: HttpClient) {}

  addBolsa(bolsa: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, bolsa)
      .pipe(catchError(this.handleError));
  }

  addRequisitos(requisitos: Requisito[]): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrlRequisitos}`, { requisitos })
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

  getActiveBolsas(): Observable<BolsaDeTrabajoResponse> {
    return this.http
      .get<BolsaDeTrabajoResponse>(`${this.apiUrl}?status=activo`)
      .pipe(catchError(this.handleError));
  }
  

  updateBolsa(id: number, bolsa: any): Observable<any> {
    const body = { id, ...bolsa };
    return this.http
      .put<any>(`${this.apiUrl}?id=${id}`, bolsa)
      .pipe(catchError(this.handleError));
  }

  updateBolsaStatus(id: number, activo: boolean): Observable<any> {
    const body = { id, activo };
    return this.http
      .put<any>(`${this.apiUrl}?id=${id}`, body)
      .pipe(catchError(this.handleError));
  }

  deleteBolsa(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  getRequisitos(id:number): Observable<any> {
   return this.http.get<any>(`${this.apiUrlRequisitos}?id=${id}`);
  }

    updateRequisitos(requisitos: Requisito[]): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrlRequisitos}`, { requisitos })
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
    //console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
