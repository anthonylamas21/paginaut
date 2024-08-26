import { Component, OnInit, HostListener } from '@angular/core';
import { HistorialService } from '../../historial.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-principal-admin',
  templateUrl: './principal-admin.component.html',
  styleUrls: ['./principal-admin.component.css']
})
export class PrincipalAdminComponent implements OnInit {
  historial: any[] = [];  // Aquí se almacenarán los datos del historial

  constructor(private historialService: HistorialService) { }

  ngOnInit(): void {
    this.setNavbarColor();
    this.loadHistorial();  // Carga los datos del historial
  }

  private loadHistorial(): void {
    this.historialService.getHistorial().subscribe(
      data => {
        this.historial = data;  // Carga todos los registros de historial
      },
      error => {
        console.error('Error al obtener el historial', error);
      }
    );
  }

  getTitle(item: any): string {
    return `Operación: ${this.capitalize(item.operacion)} en ${this.capitalize(item.tabla)}`;
  }

  getDescription(item: any): string {
    let description = `Operación: ${item.operacion} realizada en la tabla ${item.tabla}. `;

    if (item.operacion === 'INSERT') {
      description += `Se ha creado un nuevo registro con ID ${item.registro_id}.`;
    } else if (item.operacion === 'UPDATE') {
      description += `Se ha actualizado el registro con ID ${item.registro_id}.`;
    } else if (item.operacion === 'DELETE') {
      description += `Se ha eliminado el registro con ID ${item.registro_id}.`;
    }

    description += ` Detalles: ${this.getDetallesEspecificos(item)}`;

    return description;
  }

  getDetallesEspecificos(item: any): string {
    switch (item.tabla) {
      case 'Rol':
        return `Rol: ${item.datos_anteriores.nombre}`;
      case 'Departamento':
        return `Departamento: ${item.datos_anteriores.nombre}`;
      case 'Instalaciones':
        return `Instalación: ${item.datos_anteriores.nombre}`;
      case 'Usuario':
        return `Correo: ${item.datos_anteriores.correo}, Rol ID: ${item.datos_anteriores.rol_id}`;
      case 'Direccion':
        return `Dirección: ${item.datos_anteriores.nombre}`;
      case 'NivelesEstudios':
        return `Nivel: ${item.datos_anteriores.nivel}`;
      case 'CampoEstudio':
        return `Campo: ${item.datos_anteriores.campo}`;
      case 'Carrera':
        return `Carrera: ${item.datos_anteriores.nombre_carrera}`;
      case 'Cuatrimestre':
        return `Cuatrimestre: ${item.datos_anteriores.numero}`;
      case 'Asignatura':
        return `Asignatura: ${item.datos_anteriores.nombre}`;
      case 'Imagenes':
        return `Imagen: ${item.datos_anteriores.titulo}`;
      case 'Archivos':
        return `Archivo: ${item.datos_anteriores.nombre_archivo}`;
      case 'Evento':
        return `Evento: ${item.datos_anteriores.titulo}, Lugar: ${item.datos_anteriores.lugar_evento}`;
      case 'Curso':
        return `Curso: ${item.datos_anteriores.nombre}`;
      case 'Noticia':
        return `Noticia: ${item.datos_anteriores.titulo}`;
      case 'Calendario':
        return `Calendario: ${item.datos_anteriores.titulo}`;
      case 'BolsaDeTrabajo':
        return `Trabajo: ${item.datos_anteriores.titulo_trabajo}`;
      case 'Taller':
        return `Taller: ${item.datos_anteriores.nombre}`;
      case 'beca':
        return `Beca: ${item.datos_anteriores.nombre}`;
      case 'TiposProfesores':
        return `Tipo de Profesor: ${item.datos_anteriores.tipo}`;
      case 'Profesores':
        return `Profesor: ${item.datos_anteriores.nombre} ${item.datos_anteriores.apellido}`;
      default:
        return `Detalles no disponibles para la tabla ${item.tabla}`;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }

  private setNavbarColor(): void {
    const button = document.getElementById('scrollTopButton');
    const nabvar = document.getElementById('navbarAccion');
    const inicioSection = document.getElementById('inicio');

    if (inicioSection && nabvar) {
      const inicioSectionBottom = inicioSection.getBoundingClientRect().bottom;

      if (window.scrollY > inicioSectionBottom) {
        button?.classList.remove('hidden');
      } else {
        button?.classList.add('hidden');
      }

      nabvar.classList.remove('bg-transparent');
      nabvar.classList.add('bg-[#043D3D]');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
