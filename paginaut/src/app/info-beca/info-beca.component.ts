import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BecaService, Beca } from '../admin/beca.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-info-beca',
  templateUrl: './info-beca.component.html',
  styleUrls: ['./info-beca.component.css']
})
export class InfoBecaComponent implements OnInit {
  beca: Beca | null = null;
  error: string | null = null;
  safeArchivoUrl: SafeResourceUrl | null = null;
  private baseUrl = 'http://localhost/paginaut/'; // Asegúrate de que esto coincida con la base de tu API

  constructor(
    private route: ActivatedRoute,
    private becaService: BecaService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.setNavbarColor();
    this.cargarDetalleBeca();
  }

  cargarDetalleBeca(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.becaService.getBecaById(Number(id)).subscribe({
        next: (beca) => {
          this.beca = beca;
          this.actualizarSafeArchivoUrl();
        },
        error: (error) => {
          console.error('Error al cargar el detalle de la beca:', error);
          this.error = 'No se pudo cargar el detalle de la beca. Por favor, intente más tarde.';
        }
      });
    }
  }

  private actualizarSafeArchivoUrl(): void {
    if (this.beca && this.beca.archivo) {
      const fullUrl = this.getFullUrl(this.beca.archivo);
      console.log('URL completa del archivo:', fullUrl); // Log para depuración
      this.safeArchivoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    } else {
      this.safeArchivoUrl = null;
    }
  }

  private getFullUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${this.baseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
  }

  get nombreBeca(): string {
    return this.beca?.nombre ?? 'Beca no disponible';
  }

  get descripcionBeca(): string {
    return this.beca?.descripcion ?? 'Descripción no disponible';
  }

  get archivoBeca(): string | null {
    return this.beca?.archivo ? this.getFullUrl(this.beca.archivo) : null;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }

  private setNavbarColor(): void {
    const button = document.getElementById('scrollTopButton');
    const navbar = document.getElementById('navbarAccion');
    const inicioSection = document.getElementById('inicio');

    if (inicioSection && navbar) {
      const inicioSectionBottom = inicioSection.getBoundingClientRect().bottom;

      if (window.scrollY > inicioSectionBottom) {
        button?.classList.remove('hidden');
      } else {
        button?.classList.add('hidden');
      }
      
      navbar.classList.remove('bg-transparent');
      navbar.classList.add('bg-[#043D3D]');
    }
  }
  
  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}