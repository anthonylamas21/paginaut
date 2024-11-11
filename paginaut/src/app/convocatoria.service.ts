import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API } from './constans';

export interface Convocatoria {
  id?: number;
  titulo: string;
  descripcion: string;
  activo: boolean;
  lugar: string;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: string;
  hora_fin: string;
  es_curso: boolean;
  curso_id?: number;
  imagen_principal?: string;
  imagenes_generales?: string[];
  archivos?: any[];
  [key: string]: any;
}

export interface ConvocatoriaResponse {
  records: Convocatoria[];
}

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaService {
  private apiUrl = API+'/api/convocatoria';

  constructor(private http: HttpClient) {}

  crearConvocatoria(convocatoria: Convocatoria, imagenPrincipal?: File, imagenesGenerales?: File[], archivos?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('titulo', convocatoria.titulo);
    formData.append('descripcion', convocatoria.descripcion);
    formData.append('activo', convocatoria.activo.toString());
    formData.append('lugar', convocatoria.lugar);
    formData.append('fecha_inicio', convocatoria.fecha_inicio);
    formData.append('fecha_fin', convocatoria.fecha_fin);
    formData.append('hora_inicio', convocatoria.hora_inicio);
    formData.append('hora_fin', convocatoria.hora_fin);
    formData.append('es_curso', convocatoria.es_curso.toString());
    if (convocatoria.curso_id !== undefined && convocatoria.curso_id !== null) {
      formData.append('curso_id', convocatoria.curso_id.toString());
    }

    if (imagenPrincipal) {
      formData.append('imagen_principal', imagenPrincipal);
    }

    if (imagenesGenerales) {
      imagenesGenerales.forEach((imagen, index) => {
        formData.append(`imagenes_generales[${index}]`, imagen);
      });
    }

    if (archivos) {
      archivos.forEach((archivo, index) => {
        formData.append(`archivos[${index}]`, archivo);
      });
    }

    return this.http.post<any>(this.apiUrl, formData);
  }

  obtenerConvocatorias(): Observable<ConvocatoriaResponse> {
    return this.http.get<ConvocatoriaResponse>(this.apiUrl);
  }

  GetConvocatorias(id: number): Observable<Convocatoria> {
    return this.http.get<Convocatoria>(`${this.apiUrl}?id=${id}`);
  }

  actualizarConvocatoria(convocatoria: Convocatoria, imagenPrincipal?: File, imagenesGenerales?: File[], archivos?: File[]): Observable<any> {
    const formData: FormData = new FormData();

    Object.keys(convocatoria).forEach(key => {
      if (convocatoria[key] !== undefined && convocatoria[key] !== null && key !== 'imagen_principal' && key !== 'imagenes_generales' && key !== 'archivos') {
        formData.append(key, convocatoria[key].toString());
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

    if (archivos && archivos.length > 0) {
      archivos.forEach((archivo, index) => {
        formData.append(`archivos[]`, archivo, archivo.name);
      });
    }

    return this.http.post(`${this.apiUrl}?id=${convocatoria.id}`, formData);
  }

  eliminarConvocatoria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }

  eliminarArchivo(convocatoriaId: number, rutaArchivo: string): Observable<any> {
    // Asegúrate de usar 'eventoId' en lugar de 'convocatoriaId' en la URL
    return this.http.delete<any>(`${this.apiUrl}?eventoId=${convocatoriaId}&rutaArchivo=${encodeURIComponent(rutaArchivo)}`);
  }
  
  eliminarImagenGeneral(convocatoriaId: number, rutaImagen: string): Observable<any> {
    // Asegúrate de usar 'eventoId' en lugar de 'convocatoriaId' en la URL
    return this.http.delete<any>(`${this.apiUrl}?eventoId=${convocatoriaId}&rutaImagen=${encodeURIComponent(rutaImagen)}`);
  }
  
  

  desactivarConvocatoria(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}&accion=desactivar`, {});
  }

  activarConvocatoria(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}&accion=activar`, {});
  }

  obtenerConvocatoriasRecientes(): Observable<Convocatoria[]> {
    return this.http.get<ConvocatoriaResponse>(this.apiUrl).pipe(
      map(response => response.records
        .filter(convocatoria => convocatoria.activo)
        .sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime())
      )
    );
  }

  obtenerConvocatoria(id: number): Observable<Convocatoria> {
    return this.http.get<Convocatoria>(`${this.apiUrl}?id=${id}`);
  }

  obtenerConvocatoriasPorCursoId(cursoId: number): Observable<Convocatoria[]> {
    return this.http.get<ConvocatoriaResponse>(`${this.apiUrl}?curso_id=${cursoId}`).pipe(
      map((response: ConvocatoriaResponse) => response.records)
    );
  }

}
