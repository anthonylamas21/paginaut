import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService, Curso } from '../cursoService/curso.service';
import { Evento, EventoService } from '../evento.service';

@Component({
  selector: 'app-info-curso',
  templateUrl: './info-curso.component.html',
  styleUrls: ['./info-curso.component.css']
})
export class InfoCursoComponent implements OnInit {
  curso: Curso | undefined;
  eventos: Evento[] = [];
  isLoading = true;

  constructor(private route: ActivatedRoute, private cursoService: CursoService, private eventoService: EventoService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cursoService.obtenerCursoPorId(id).subscribe({
        next: (curso) => {
          this.curso = curso;
          this.isLoading = false;
          this.cargarEventos(id);
        },
        error: (error) => {
          console.error('Error al cargar el curso:', error);
          this.isLoading = false;
        }
      });
    }
    this.setNavbarColor();
  }

  private cargarEventos(cursoId: number): void {
    this.eventoService.obtenerEventosPorCursoId(cursoId).subscribe({
      next: (eventos) => {
        // Filtra los eventos que son cursos y pertenecen a este curso
        this.eventos = eventos.filter(evento => evento.es_curso && evento.curso_id === cursoId);
      },
      error: (error) => {
        console.error('Error al cargar los eventos:', error);
      }
    });
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

  getImageUrl(relativePath: string): string {
    const baseImageUrl = 'http://localhost/paginaut/';
    return baseImageUrl + relativePath;
  }
}
