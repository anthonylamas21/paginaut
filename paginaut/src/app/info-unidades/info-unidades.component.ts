import { Component, OnInit, AfterViewInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstalacionService, Instalacion, InstalacionResponse } from '../instalacionService/instalacion.service';

@Component({
  selector: 'app-info-unidades',
  templateUrl: './info-unidades.component.html',
  styleUrls: ['./info-unidades.component.css']
})
export class InfoUnidadesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  instalacion: Instalacion | null = null;
  groupedImages: { [key: string]: any[] } = {};
  selectedImage: { url: string, alt: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private instalacionService: InstalacionService,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarInstalacion();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setNavbarColor();
      this.isLoading = false;
      this.cdRef.detectChanges();
    }, 0);
  }

  cargarInstalacion(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.instalacionService.obtenerInstalacionPorId(+id).subscribe({
        next: (instalacion: Instalacion) => {
          this.instalacion = instalacion;
          this.groupImagesByMonth();
          this.isLoading = false;
        },
        error: (error: string) => {
          console.error('Error al cargar la instalación:', error);
          this.isLoading = false;
        }
      });
    }
  }

  groupImagesByMonth(): void {
    if (this.instalacion && this.instalacion.imagenes_generales) {
      this.instalacion.imagenes_generales.forEach((imagen, index) => {
        const date = this.instalacion?.fecha_publicacion 
          ? new Date(this.instalacion.fecha_publicacion) 
          : new Date(new Date().setDate(new Date().getDate() - index));

        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        if (!this.groupedImages[month]) {
          this.groupedImages[month] = [];
        }
        
        this.groupedImages[month].push({
          url: this.getImageUrl(imagen),
          alt: `Imagen ${index + 1} de ${this.instalacion?.nombre || 'la instalación'}`,
          date: date
        });
      });
    }
  }

  getImageUrl(path: string): string {
    return `http://localhost/paginaut/${path}`;
  }

  sortByMonth = (a: { key: string }, b: { key: string }): number => {
    const dateA = new Date(a.key);
    const dateB = new Date(b.key);
    return dateB.getTime() - dateA.getTime();
  };

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

  openImageModal(image: { url: string, alt: string }): void {
    this.selectedImage = image;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }
}