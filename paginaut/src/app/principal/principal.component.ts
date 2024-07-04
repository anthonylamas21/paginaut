import { Component, HostListener, OnInit } from '@angular/core';
import { EventoService, Evento } from '../evento.service';
import { NoticiaService, Noticia } from '../noticia.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  eventosRecientes: Evento[] = [];
  noticias: Noticia[] = [];
  noticiasVisibles: Noticia[] = [];
  cantidadInicial = 3;
  incremento = 3;

  constructor(
    private eventoService: EventoService,
    private noticiaService: NoticiaService
  ) {}

  ngOnInit() {
    this.cargarEventosRecientes();
    this.cargarNoticias();
  }

  cargarEventosRecientes(): void {
    this.eventoService.obtenerEventosRecientes().subscribe({
      next: (eventos) => {
        this.eventosRecientes = eventos.map(evento => ({
          ...evento,
          imagen_principal: this.getImageUrl(evento.imagen_principal || ''),
          imagenes_generales: (evento.imagenes_generales || []).map((img: string) => this.getImageUrl(img))
        }));
      },
      error: (error) => console.error('Error al cargar eventos recientes:', error)
    });
  }

  cargarNoticias(): void {
    this.noticiaService.obtenerNoticias().subscribe({
      next: (response) => {
        this.noticias = response.records.map(noticia => ({
          ...noticia,
          imagen_principal: this.getImageUrl(noticia.imagen_principal || ''),
          imagenes_generales: (noticia.imagenes_generales || []).map((img: string) => this.getImageUrl(img))
        }));
        this.noticiasVisibles = this.noticias.slice(0, this.cantidadInicial);
      },
      error: (error) => console.error('Error al cargar noticias:', error)
    });
  }

  getImageUrl(relativePath: string): string {
    const baseImageUrl = 'http://localhost/paginaut/';
    if (relativePath && relativePath.startsWith('../')) {
      return baseImageUrl + relativePath.substring(3);
    }
    return baseImageUrl + relativePath;
  }

  verMasNoticias(): void {
    const nuevaCantidad = this.noticiasVisibles.length + this.incremento;
    this.noticiasVisibles = this.noticias.slice(0, nuevaCantidad);
  }
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const button = document.getElementById('scrollTopButton');
    const nabvar = document.getElementById('navbarAccion');
    const inicioSection = document.getElementById('inicio');
  
    if (inicioSection && nabvar) {
      const inicioSectionBottom = inicioSection.getBoundingClientRect().bottom;
  
      if (window.scrollY > inicioSectionBottom) {
        button?.classList.remove('hidden');
        nabvar.classList.remove('bg-transparent', 'transition-colors', 'duration-500');
        nabvar.classList.add('bg-[#043D3D]', 'transition-colors', 'duration-500');
      } else {
        button?.classList.add('hidden');
        nabvar.classList.remove('bg-[#043D3D]', 'transition-colors', 'duration-500');
        nabvar.classList.add('bg-transparent', 'transition-colors', 'duration-500');
      }
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

}