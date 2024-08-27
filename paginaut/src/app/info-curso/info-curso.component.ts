import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService, Curso } from '../cursoService/curso.service';
import { Evento, EventoService } from '../evento.service';
import { Profesor } from './../admin/profesor.service';
import Hashids from 'hashids';

@Component({
  selector: 'app-info-curso',
  templateUrl: './info-curso.component.html',
  styleUrls: ['./info-curso.component.css']
})
export class InfoCursoComponent implements OnInit {
  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 10);
  curso: Curso | undefined;
  eventos: Evento[] = [];
  profesores: Profesor[] = []; // Inicializar como un array vacío
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      const id = this.hashids.decode(encryptedId)[0] as number;
      if (id) {
        this.cursoService.obtenerCursoPorId(id).subscribe({
          next: (curso) => {
            this.curso = curso;
            this.curso.imagenes_generales = this.curso.imagenes_generales || []; // Asegura que sea un array
            this.isLoading = false;
            this.cargarEventos(id);
            this.ObtenerProfesoresPorCurso(id);
          },
          error: (error) => {
            //console.error('Error al cargar el curso:', error);
            this.isLoading = false;
            this.redirectToNotFound();
          }
        });
      } else {
        //console.error('ID decodificado no válido');
        this.redirectToNotFound();
      }
    } else {
      //console.error('ID encriptado no disponible');
      this.redirectToNotFound();
    }
    this.setNavbarColor();
  }

  private redirectToNotFound(): void {
    this.router.navigate(['/not-found']);
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

  ObtenerProfesoresPorCurso(cursoId: number): void {
    this.cursoService.obtenerProfesoresPorCurso(cursoId).subscribe({
      next: (response) => {
        const profesoresDelCurso = response.profesores.map((p: any) => p.profesor_id);
  
        this.cursoService.GetProfesores().subscribe({
          next: (data) => {
            this.profesores = data.records.filter((profesor: any) =>
              profesoresDelCurso.includes(profesor.id)
            );
          },
          error: (error) => {
            console.error('Error al cargar la información de los profesores:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar los profesores del curso:', error);
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

  getImageUrl(relativePath: string | undefined): string {
    const baseImageUrl = 'http://localhost/paginaut/';
    return relativePath ? baseImageUrl + relativePath : baseImageUrl + 'paginaut/src/assets/img/perfil_vacio_2.png';
  }
}
