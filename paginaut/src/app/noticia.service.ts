import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API } from './constans';

export interface Noticia {
  id?: number;
  titulo: string;
  resumen: string;
  informacion_noticia: string;
  activo: boolean;
  lugar_noticia: string;
  autor: string;
  fecha_publicacion: string;
  imagen_principal?: string;
  fecha_string?: string;
  imagenes_generales?: string[];
  [key: string]: any; // Esto permite la indexación con strings
}

export interface NoticiaResponse {
  records: Noticia[];
}

@Injectable({
  providedIn: 'root',
})
export class NoticiaService {
  private apiUrl = API+'/api/noticia';

  constructor(private http: HttpClient) {}

  crearNoticia(
    noticia: Noticia,
    imagenPrincipal?: File,
    imagenesGenerales?: File[]
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('titulo', noticia.titulo);
    formData.append('resumen', noticia.resumen);
    formData.append('informacion_noticia', noticia.informacion_noticia);
    formData.append('activo', noticia.activo.toString());
    formData.append('lugar_noticia', noticia.lugar_noticia);
    formData.append('autor', noticia.autor);
    formData.append('fecha_publicacion', noticia.fecha_publicacion);

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

  obtenerNoticias(): Observable<NoticiaResponse> {
    return this.http.get<NoticiaResponse>(this.apiUrl);
  }

  actualizarNoticia(
    noticia: Noticia,
    imagenPrincipal?: File,
    imagenesGenerales?: File[]
  ): Observable<any> {
    const formData: FormData = new FormData();

    Object.keys(noticia).forEach((key) => {
      if (
        noticia[key] !== undefined &&
        noticia[key] !== null &&
        key !== 'imagen_principal' &&
        key !== 'imagenes_generales'
      ) {
        formData.append(key, noticia[key].toString());
      }
    });

    if (imagenPrincipal) {
      formData.append(
        'imagen_principal',
        imagenPrincipal,
        imagenPrincipal.name
      );
    }

    if (imagenesGenerales && imagenesGenerales.length > 0) {
      imagenesGenerales.forEach((imagen, index) => {
        formData.append(`imagenes_generales[]`, imagen, imagen.name);
      });
    }

    return this.http.post(`${this.apiUrl}?id=${noticia.id}`, formData);
  }

  eliminarNoticia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }

  eliminarImagenGeneral(
    noticiaId: number,
    rutaImagen: string
  ): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}?noticiaId=${noticiaId}&rutaImagen=${encodeURIComponent(
        rutaImagen
      )}`
    );
  }

  desactivarNoticia(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}&accion=desactivar`, {});
  }

  activarNoticia(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}&accion=activar`, {});
  }

  obtenerNoticia(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.apiUrl}?id=${id}`);
  }

  obtenerNoticiasActivas(): Observable<Noticia[]> {
    return this.http.get<NoticiaResponse>(this.apiUrl).pipe(
      map((response) =>
        response.records
          .filter((noticia) => noticia.activo)
          .sort(
            (a, b) =>
              new Date(b.fecha_publicacion).getTime() -
              new Date(a.fecha_publicacion).getTime()
          )
      )
    );
  }
}
