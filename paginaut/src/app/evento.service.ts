import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Evento {
  id?: number;
  titulo: string;
  informacion_evento: string;
  activo: boolean;
  lugar_evento: string;
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


export interface EventoResponse {
  records: Evento[];
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = 'http://localhost/paginaut/api/evento';

  constructor(private http: HttpClient) {}

  crearEvento(evento: Evento, imagenPrincipal?: File, imagenesGenerales?: File[], archivos?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('titulo', evento.titulo);
    formData.append('informacion_evento', evento.informacion_evento);
    formData.append('activo', evento.activo.toString());
    formData.append('lugar_evento', evento.lugar_evento);
    formData.append('fecha_inicio', evento.fecha_inicio);
    formData.append('fecha_fin', evento.fecha_fin);
    formData.append('hora_inicio', evento.hora_inicio);
    formData.append('hora_fin', evento.hora_fin);
    formData.append('es_curso', evento.es_curso.toString());
    if (evento.curso_id !== undefined && evento.curso_id !== null) {
      formData.append('curso_id', evento.curso_id.toString());
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

  obtenerEventos(): Observable<EventoResponse> {
    return this.http.get<EventoResponse>(this.apiUrl);
  }

  actualizarEvento(evento: Evento, imagenPrincipal?: File, imagenesGenerales?: File[], archivos?: File[]): Observable<any> {
    const formData: FormData = new FormData();

    Object.keys(evento).forEach(key => {
      if (evento[key] !== undefined && evento[key] !== null && key !== 'imagen_principal' && key !== 'imagenes_generales' && key !== 'archivos') {
        formData.append(key, evento[key].toString());
      }
    });

    if (imagenPrincipal) {
      formData.append('imagen_principal', imagenPrincipal, imagenPrincipal.name);
      console.log('Imagen Principal añadida al FormData:', imagenPrincipal.name);
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
    console.log('Contenido del FormData:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return this.http.post(`${this.apiUrl}?id=${evento.id}`, formData);
  }

  eliminarEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }

  eliminarImagenGeneral(eventoId: number, rutaImagen: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?eventoId=${eventoId}&rutaImagen=${encodeURIComponent(rutaImagen)}`);
  }

  eliminarArchivo(eventoId: number, rutaArchivo: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?eventoId=${eventoId}&rutaArchivo=${encodeURIComponent(rutaArchivo)}`);
  }

  desactivarEvento(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}&accion=desactivar`, {});
  }

  activarEvento(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}&accion=activar`, {});
  }
  obtenerEventosRecientes(limit: number = 5): Observable<Evento[]> {
    return this.http.get<EventoResponse>(this.apiUrl).pipe(
      map(response => response.records
        .filter(evento => evento.activo)
        .sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime())
        .slice(0, limit)
      )
    );
  }
  obtenerEvento(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}?id=${id}`);
  }


}
