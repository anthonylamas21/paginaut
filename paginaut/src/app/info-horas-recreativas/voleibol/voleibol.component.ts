import { Component, HostListener } from '@angular/core';

interface Image {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-voleibol',
  templateUrl: './voleibol.component.html',
  styleUrl: './voleibol.component.css'
})
export class VoleibolComponent {

  images: Image[] = [
    { url: './assets/img/galeria/extras/voleibol/voleibol1.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/voleibol/voleibol2.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/voleibol/voleibol3.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/voleibol/voleibol4.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/extras/voleibol/voleibol5.webp', alt: 'Image 1' },
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
