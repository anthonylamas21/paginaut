import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Taller {
  nombre: string;
  descripcion: string;
  competencia: string;
}

@Injectable({
  providedIn: 'root'
})
export class TallerService {
  private apiUrl = 'http://localhost/paginaut/api/taller.php';

  constructor(private http: HttpClient) {}

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
}
