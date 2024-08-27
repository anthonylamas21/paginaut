import { Component, OnInit, AfterViewInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { InstalacionService, Instalacion, InstalacionResponse } from '../instalacionService/instalacion.service';
import Hashids from 'hashids';

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
        console.error('Error al cargar instalaciones:', error);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(path: string | undefined): string {
    if (path) {
      return `http://localhost/paginaut/${path}`;
    }
    return 'path/to/default/image.jpg';
  }

  verGaleria(id: number | undefined): void {
    if (id !== undefined) {
      const encryptedId = this.hashids.encode(id);
      window.location.href = `/info-unidades/${encryptedId}`;
    } else {
      //console.error('ID de instalación no disponible');
    }
  }
  

  private setNavbarColor(): void {
    const navbar = document.getElementById('navbarAccion');
    if (navbar) {
      this.renderer.removeClass(navbar, 'bg-transparent');
      this.renderer.addClass(navbar, 'bg-[#043D3D]');
      this.renderer.setStyle(navbar, 'position', 'fixed');
      this.renderer.setStyle(navbar, 'top', '0');
      this.renderer.setStyle(navbar, 'left', '0');
      this.renderer.setStyle(navbar, 'right', '0');
      this.renderer.setStyle(navbar, 'z-index', '1000');
    }

    const button = document.getElementById('scrollTopButton');
    if (button) {
      this.renderer.addClass(button, 'hidden');
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}