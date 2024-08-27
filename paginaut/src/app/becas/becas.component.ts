import { Component, OnInit, AfterViewInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { BecaService, Beca } from '../admin/beca.service';
import Hashids from 'hashids';

@Component({
  selector: 'app-becas',
  templateUrl: './becas.component.html',
  styleUrls: ['./becas.component.css']
})
export class BecasComponent implements OnInit, AfterViewInit {
  isLoading = true;
  becasInternas: Beca[] = [];
  becasExternas: Beca[] = [];
  error: string | null = null;
  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 10);

  constructor(
    private becaService: BecaService,
    private router: Router,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetTabs();
      }
    });
  }

  ngOnInit() {
    this.cargarBecas();
  }

  resetTabs() {
    // Restablecer el estado de los tabs al regresar a la página
    const firstTab = document.getElementById('pills-on-gray-color-item-1');
    if (firstTab) {
      firstTab.click();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setNavbarColor();
      this.cdRef.detectChanges();
    }, 0);
  }

  cargarBecas(): void {
    this.becaService.getBecas().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.records)) {
          // Clasificar becas en internas y externas
          this.becasInternas = response.records.filter(beca => beca.activo && beca.tipo === 'interna');
          this.becasExternas = response.records.filter(beca => beca.activo && beca.tipo === 'externa');
        } else {
          console.error('La respuesta no tiene la estructura esperada:', response);
          this.error = 'La respuesta del servidor no tiene el formato esperado.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar becas:', error);
        this.error = 'No se pudieron cargar las becas. Por favor, intente más tarde.';
        this.isLoading = false;
      }
    });
  }

  verDetalleBeca(id: number | undefined): void {
    if (id !== undefined) {
      const encryptedId = this.hashids.encode(id);
      window.location.href = `/info-beca/${encryptedId}`;
    } else {
      //console.error('ID de instalación no disponible');
    }
  }

  getFileUrl(relativePath: string): string {
    const baseUrl = 'http://localhost/paginaut/';
    if (relativePath && relativePath.startsWith('../')) {
      return baseUrl + relativePath.substring(3);
    }
    return baseUrl + relativePath;
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
