import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent {

  images = [
    { url: './assets/img/galeria/mg1.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/mg2.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/mg3.jpg', alt: 'Image 3' },
    { url: './assets/img/galeria/mg4.jpg', alt: 'Image 4' },
    { url: './assets/img/galeria/mg5.jpg', alt: 'Image 5' },
    { url: './assets/img/galeria/mg6.jpg', alt: 'Image 6' },
    { url: './assets/img/galeria/mg7.jpg', alt: 'Image 7' },
    { url: './assets/img/galeria/mg8.png', alt: 'Image 8' },
    { url: './assets/img/galeria/mg9.jpg', alt: 'Image 9' },
    { url: './assets/img/galeria/mg10.png', alt: 'Image 10' },
    { url: './assets/img/galeria/mg11.jpg', alt: 'Image 11' },
    // ... más imágenes ...
  ];

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
