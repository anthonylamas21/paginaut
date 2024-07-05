import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BecaService, Beca } from '../admin/beca.service';

@Component({
  selector: 'app-becas',
  templateUrl: './becas.component.html',
  styleUrls: ['./becas.component.css']
})
export class BecasComponent implements OnInit {
  isLoading = true;
  becas: Beca[] = [];
  error: string | null = null;

  constructor(
    private becaService: BecaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarBecas();
    this.setNavbarColor();
  }

  cargarBecas(): void {
    this.becaService.getBecas().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.records)) {
                    this.becas = response.records.filter(beca => beca.activo); // Filtrar becas activas
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
      this.router.navigate(['/info-beca', id]);
    } else {
      console.error('ID de beca no disponible');
      // Aquí puedes manejar el caso cuando el ID no está disponible,
      // por ejemplo, mostrando un mensaje al usuario.
    }
  }

  getFileUrl(relativePath: string): string {
    const baseUrl = 'http://localhost/paginaut/';
    if (relativePath && relativePath.startsWith('../')) {
      return baseUrl + relativePath.substring(3);
    }
    return baseUrl + relativePath;
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