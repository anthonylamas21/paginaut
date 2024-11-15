import { Component, OnInit, AfterViewInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstalacionService, Instalacion, InstalacionResponse } from '../instalacionService/instalacion.service';
import Hashids from 'hashids';
import { BASEIMAGEN } from '../constans';

@Component({
  selector: 'app-info-unidades',
  templateUrl: './info-unidades.component.html',
  styleUrls: ['./info-unidades.component.css']
})
export class InfoUnidadesComponent implements OnInit, AfterViewInit {

  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 16);
  idDecrypted: number | undefined;
  hasImages?: boolean = false;
  isLoading = true;
  instalacion: Instalacion | null = null;
  groupedImages: { [key: string]: any[] } = {};
  selectedImage: { url: string, alt: string } | null = null;

  imagenAmpliada: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private instalacionService: InstalacionService,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {
    // Desencriptar el ID en el constructor
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      try {
        this.idDecrypted = this.hashids.decode(encryptedId)[0] as number;
        if (!this.idDecrypted) {
          throw new Error('ID no válido');
        }
      } catch (error) {
        // console.error('Error al desencriptar el ID:', error);
        this.router.navigate(['/not-found']);
      }
    } else {
      // console.error('ID de instalación no disponible');
      this.router.navigate(['/not-found']);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encryptedId = params.get('id');
      if (encryptedId) {
        try {
          const decryptedId = this.hashids.decode(encryptedId)[0] as number;
          if (isNaN(decryptedId)) {
            this.redirectToNotFound();
          } else {
            this.loadInstalacion(decryptedId);
          }
        } catch (error) {
          this.redirectToNotFound();
        }
      } else {
        this.redirectToNotFound();
      }
    });
  }

  private redirectToNotFound(): void {
    this.router.navigate(['/not-found']);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setNavbarColor();
      this.isLoading = false;
      this.cdRef.detectChanges();
    }, 0);
  }

  private loadInstalacion(id: number): void {
    this.isLoading = true;
    this.instalacionService.obtenerInstalacionPorId(id).subscribe({
      next: (instalacion: Instalacion) => {
        if (instalacion && instalacion.activo) {
          this.instalacion = instalacion;
          // Verificar si hay imágenes antes de agruparlas
          this.hasImages = instalacion.imagenes_generales && 
                          instalacion.imagenes_generales.length > 0;
          
          if (this.hasImages) {
            this.groupImagesByMonth();
          }
          this.isLoading = false;
        } else {
          this.redirectToNotFound();
        }
      },
      error: () => {
        this.isLoading = false;
        this.redirectToNotFound();
      }
    });
  }

  groupImagesByMonth(): void {
    if (this.instalacion && this.instalacion.imagenes_generales) {
      this.instalacion.imagenes_generales.forEach((imagen: any, index: number) => {
        // Accede a la fecha de creación de cada imagen
        const fechaCreacion = imagen.fecha_creacion;
        const date = fechaCreacion ? new Date(fechaCreacion) : new Date();
  
        // Formatea la fecha en mes y año
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
  
        // Capitaliza la primera letra del mes
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  
        // Si no existe un grupo para este mes, se crea
        if (!this.groupedImages[capitalizedMonth]) {
          this.groupedImages[capitalizedMonth] = [];
        }
  
        // Se agrega la imagen al grupo correspondiente
        this.groupedImages[capitalizedMonth].push({
          url: this.getImageUrl(imagen.ruta_imagen),
          alt: `Imagen ${index + 1} de ${this.instalacion?.nombre || 'la instalación'}`,
          date: date
        });
      });
    }
  }
  
  
  getImageUrl(path: string): string {
    return BASEIMAGEN+`/${path}`;
  }
  

  sortByMonth = (a: { key: string }, b: { key: string }): number => {
    // Convertir los meses a fechas completas para comparar correctamente
    const dateA = new Date(`01 ${a.key}`); // '01' para fijar el día y comparar solo mes y año
    const dateB = new Date(`01 ${b.key}`);
    
    // Orden ascendente: fechas más recientes primero
    return dateB.getTime() - dateA.getTime();
  };

  private setNavbarColor(): void {
    const navbar = document.getElementById('navbarAccion');
    if (navbar) {
      this.renderer.removeClass(navbar, 'bg-transparent');
      this.renderer.addClass(navbar, 'bg-primary-color');
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

  openModal(image: { url: string, alt: string }): void {
    this.selectedImage = image;
    const modal = document.getElementById('hs-vertically-centered-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('pointer-events-auto');
    }
  }
  
  closeModal(): void {
    const modal = document.getElementById('hs-vertically-centered-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('pointer-events-auto');
    }
    this.selectedImage = null;
  }
  
  
  ampliarImagen(imagenUrl: string): void {
    this.imagenAmpliada = imagenUrl;
  }
  
  cerrarImagenAmpliada(): void {
    this.imagenAmpliada = null;
  }
}
