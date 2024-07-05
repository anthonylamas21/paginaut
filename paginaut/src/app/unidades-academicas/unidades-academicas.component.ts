import { Component, OnInit, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { InstalacionService, Instalacion, InstalacionResponse } from '../instalacionService/instalacion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-unidades-academicas',
  templateUrl: './unidades-academicas.component.html',
  styleUrls: ['./unidades-academicas.component.css']
})
export class UnidadesAcademicasComponent implements OnInit, AfterViewInit {
  isLoading = true;
  instalaciones: Instalacion[] = [];

  constructor(
    private renderer: Renderer2,
    private instalacionService: InstalacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setNavbarColor();
    this.cargarInstalaciones();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'load', () => {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    });
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
    return 'path/to/default/image.jpg'; // Proporciona una imagen por defecto
  }
  verGaleria(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/info-unidades', id]);
    } else {
      console.error('ID de instalación no disponible');
      // Aquí puedes manejar el caso cuando el ID no está disponible,
      // por ejemplo, mostrando un mensaje al usuario.
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }

  private setNavbarColor(): void {
    const button = document.getElementById('scrollTopButton');
    const navbar = document.getElementById('navbarAccion');
    const scrollY = window.scrollY;
  
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.remove('bg-transparent');
        navbar.classList.add('bg-[#043D3D]');
        button?.classList.remove('hidden');
      } else {
        navbar.classList.add('bg-transparent');
        navbar.classList.remove('bg-[#043D3D]');
        button?.classList.add('hidden');
      }
    }
  }
  
  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}