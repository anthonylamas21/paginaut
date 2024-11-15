import { Component, OnInit, AfterViewInit, Renderer2, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { InstalacionService, Instalacion, InstalacionResponse } from '../instalacionService/instalacion.service';
import Hashids from 'hashids';
import { BASEIMAGEN } from '../constans';

@Component({
  selector: 'app-unidades-academicas',
  templateUrl: './unidades-academicas.component.html',
  styleUrls: ['./unidades-academicas.component.css']
})
export class UnidadesAcademicasComponent implements OnInit, AfterViewInit {
  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 16);
  isLoading = true;
  instalaciones: Instalacion[] = [];
  

  constructor(
    private renderer: Renderer2,
    private instalacionService: InstalacionService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarInstalaciones();
  }

  ngAfterViewInit(): void {
    // Asegurarse de que el navbar se coloree después de que la vista se haya inicializado
    setTimeout(() => {
      this.setNavbarColor();
      this.cdRef.detectChanges();
    }, 0);
  }

  cargarInstalaciones(): void {
    this.instalacionService.obtenerInstalacion().subscribe({
      next: (response: InstalacionResponse) => {
        this.instalaciones = response.records.filter((inst: Instalacion) => inst.activo);
        this.isLoading = false;
      },
      error: (error: string) => {
        // console.error('Error al cargar instalaciones:', error);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(path: string | undefined): string {
    if (path) {
      return BASEIMAGEN+`/${path}`;
    }
    return 'path/to/default/image.jpg';
  }

  verGaleria(id: number | undefined): void {
    if (id !== undefined) {
      const encryptedId = this.hashids.encode(id);
      window.location.href = `/info-unidades/${encryptedId}`;
    } else {
      // console.error('ID de instalación no disponible');
    }
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