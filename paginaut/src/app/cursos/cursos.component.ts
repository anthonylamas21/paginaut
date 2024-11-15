import { Component, OnInit, HostListener } from '@angular/core';
import { Curso, CursoService } from '../cursoService/curso.service';
import { Router } from '@angular/router';
import Hashids from 'hashids';
import { BASEIMAGEN } from '../constans';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 16);
  isLoading = true;
  searchTerm: string = '';  // Término de búsqueda ingresado por el usuario
  cursos: Curso[] = [];  // Arreglo de todos los cursos
  filteredCursos: Curso[] = [];  // Arreglo de cursos filtrados
  baseImageUrl = BASEIMAGEN+'/';

  constructor(private cursoService: CursoService, private router: Router) {}

  ngOnInit(): void {
    this.loadCursos();
    this.setNavbarColor();
  }

  loadCursos(): void {
    this.cursoService.getCursos().subscribe({
      next: (response: Curso[]) => {
        this.cursos = response
          .filter(curso => curso.activo) // Filtrar solo los cursos que están activos
          .map(curso => ({
            ...curso,
            title: curso.nombre,
            description: curso.descripcion,
            image: curso.imagen_principal, 
          }));
        this.filteredCursos = this.cursos;
        this.isLoading = false;
      },
      error: (error) => {
        // console.error('Error al cargar los cursos:', error);
        this.isLoading = false;
      },
    });
  }

  recortarDescripcion(descripcion: string, maxLength: number = 100): string {
    if (descripcion.length <= maxLength) {
      return descripcion;
    }
    const trimmedText = descripcion.substring(0, maxLength);
    const lastSpaceIndex = trimmedText.lastIndexOf(' ');

    return lastSpaceIndex > 0 ? trimmedText.substring(0, lastSpaceIndex) + '...' : trimmedText + '...';
  }

  verDetalleCurso(id: number | undefined): void {
    if (id) {
      const encryptedId = this.hashids.encode(id);
      window.location.href = '/info_curso/' + encryptedId;
    } else {
      // console.error('ID del curso no disponible');
    }
  }

  filterCursos(): void {
    this.filteredCursos = this.cursos.filter(curso => 
      curso.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      curso.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
      nabvar.classList.add('bg-primary-color');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
