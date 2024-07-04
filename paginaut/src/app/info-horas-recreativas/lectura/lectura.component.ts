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
    { url: './assets/img/galeria/extras/lectura/lectura1.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura2.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura3.jpg', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura4.jpg', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura5.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura6.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura7.jpg', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura8.jpg', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura9.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura10.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura11.jpg', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura12.jpg', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura12.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura14.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura15.jpg', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura16.jpg', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura17.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura18.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura19.jpg', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura20.jpg', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura21.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/lectura/lectura22.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/lectura/lectura23.jpg', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/lectura/lectura24.jpg', alt: 'Image 4' },
    { url: './assets/img/galeria/extras/lectura/lectura25.jpg', alt: 'Image 3' },
    // más imágenes aquí
  ];

  selectedImage: Image = { url: '', alt: '' };

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
      nabvar.classList.add('bg-[#043D3D]');
    }
  }
  
  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

}
