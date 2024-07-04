import { Component, HostListener } from '@angular/core';

interface Image {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-basquetbol',
  templateUrl: './basquetbol.component.html',
  styleUrl: './basquetbol.component.css'
})
export class BasquetbolComponent {

  images: Image[] = [
    { url: './assets/img/galeria/extras/basquet/basquet1.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/basquet/basquet2.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/extras/basquet/basquet3.jpg', alt: 'Image 3' },
    { url: './assets/img/galeria/extras/basquet/basquet4.jpg', alt: 'Image 3' },
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
