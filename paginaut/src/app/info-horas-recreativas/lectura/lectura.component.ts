import { Component, HostListener } from '@angular/core';

interface Image {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-lectura',
  templateUrl: './lectura.component.html',
  styleUrl: './lectura.component.css'
})
export class LecturaComponent {

  images: Image[] = [
    { url: './assets/img/galeria/extras/lectura/lectura1.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura2.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura3.webp', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura4.webp', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura5.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura6.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura7.webp', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura8.webp', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura9.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura10.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura11.webp', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura12.webp', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura12.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura14.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura15.webp', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura16.webp', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura17.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura18.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura19.webp', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura20.webp', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura21.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura22.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura23.webp', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura24.webp', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura25.webp', alt: 'Image 3' },
    // más imágenes aquí
  ];

  selectedImage: Image | null = null;

  openModal(image: Image): void {
    if (image) {
      this.selectedImage = image;
      const modal = document.getElementById('hs-vertically-centered-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('pointer-events-auto');
      }
    }
  }

  closeModal(): void {
    const modal = document.getElementById('hs-vertically-centered-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('pointer-events-auto');
    }
    this.selectedImage = null;  // Cambiar de objeto vacío a null
  }

  ngOnInit(): void {
    this.setNavbarColor();
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
