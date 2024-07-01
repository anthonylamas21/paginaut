import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost/paginaut/api/taller';

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
  obtenerTalleres(): Observable<TallerResponse> {
    return this.http.get<TallerResponse>(this.apiUrl);
  }


  actualizarTaller(taller: Taller, imagenPrincipal?: File, imagenesGenerales?: File[], imagenesGeneralesActuales?: string[]): Observable<any> {
    const formData = new FormData();

    // Añadir los campos del taller
    formData.append('id', taller.id!.toString());
    formData.append('nombre', taller.nombre);
    formData.append('descripcion', taller.descripcion);
    formData.append('competencia', taller.competencia);
    formData.append('activo', taller.activo.toString());

    // Añadir imagen principal si existe
    if (imagenPrincipal) {
        formData.append('imagen_principal', imagenPrincipal, imagenPrincipal.name);
    }

    // Añadir nuevas imágenes generales si existen
    if (imagenesGenerales && imagenesGenerales.length > 0) {
        imagenesGenerales.forEach((imagen, index) => {
            formData.append(`imagenes_generales[${index}]`, imagen, imagen.name);
        });
    }

    // Añadir imágenes generales actuales
    if (imagenesGeneralesActuales) {
        formData.append('imagenes_generales_actuales', JSON.stringify(imagenesGeneralesActuales));
    }

    // Usar el método PUT
    return this.http.put(`${this.apiUrl}?id=${taller.id}`, formData);
}


  eliminarTaller(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }
}
