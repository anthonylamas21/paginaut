import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Beca {
  id?: number;
  nombre: string;
  descripcion: string;
  archivo: string;
  activo?: boolean;
  fecha_creacion?: string;
}
export interface BecaResponse {
  records: Beca[];
}

@Injectable({
  providedIn: 'root',
})
export class BecaService {
  private apiUrl = 'http://localhost/paginaut/api/beca.php';

  constructor(private http: HttpClient) {}

  addBeca(beca: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, beca)
      .pipe(catchError(this.handleError));
  }

  getBecas(): Observable<BecaResponse> {
    return this.http
      .get<BecaResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }
  getBecaById(id: number): Observable<Beca> {
    return this.http
      .get<Beca>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  updateBeca(beca: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}`, beca)
      .pipe(catchError(this.handleError));
  }

  updateBecaStatus(id: number, activo: boolean): Observable<any> {
    const body = { id, activo };
    return this.http
      .put<any>(this.apiUrl, body)
      .pipe(catchError(this.handleError));
  }

  deleteBeca(id: number): Observable<any> {
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
