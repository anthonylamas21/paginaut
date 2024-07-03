import { Component, HostListener } from '@angular/core';


@Component({
  selector: 'app-info-unidades',
  templateUrl: './info-unidades.component.html',
  styleUrl: './info-unidades.component.css'
})
export class InfoUnidadesComponent {
  isLoading = true;
  
  images = [
    { url: './assets/img/galeria/mg2.jpg', alt: 'Image 1', date: new Date('2023-07-01') },
    { url: './assets/img/galeria/mg2.jpg', alt: 'Image 1', date: new Date('2021-07-03') },
    { url: './assets/img/galeria/mg3.jpg', alt: 'Image 1', date: new Date('2024-07-05') },
    { url: './assets/img/galeria/mg3.jpg', alt: 'Image 1', date: new Date('2024-07-05') },
    { url: './assets/img/galeria/mg4.jpg', alt: 'Image 1', date: new Date('2023-07-12') },
    { url: './assets/img/galeria/mg5.jpg', alt: 'Image 1', date: new Date('2023-07-01') },
    { url: './assets/img/galeria/mg2.jpg', alt: 'Image 1', date: new Date('2023-07-01') },
    { url: './assets/img/galeria/mg2.jpg', alt: 'Image 2', date: new Date('2023-08-01') },
    // más imágenes aquí
  ];

  groupedImages: { [key: string]: any[] } = {};

  ngOnInit(): void {
    this.groupImagesByMonth();
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);

    this.setNavbarColor();
  }

  groupImagesByMonth(): void {
    this.images.forEach(image => {
      const month = image.date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!this.groupedImages[month]) {
        this.groupedImages[month] = [];
      }
      this.groupedImages[month].push(image);
    });
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
