import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstalacionService, Instalacion, InstalacionResponse } from '../instalacionService/instalacion.service';

@Component({
  selector: 'app-info-unidades',
  templateUrl: './info-unidades.component.html',
  styleUrls: ['./info-unidades.component.css']
})
export class InfoUnidadesComponent implements OnInit {
  isLoading = true;
  instalacion: Instalacion | null = null;
  groupedImages: { [key: string]: any[] } = {};
  selectedImage: { url: string, alt: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private instalacionService: InstalacionService
  ) {}

  ngOnInit(): void {
    this.setNavbarColor();
    this.cargarInstalacion();
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
  openImageModal(image: { url: string, alt: string }): void {
    this.selectedImage = image;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }
  

  
}
