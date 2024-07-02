import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-info-unidades',
  templateUrl: './info-unidades.component.html',
  styleUrl: './info-unidades.component.css'
})
export class InfoUnidadesComponent {
  isLoading = true;
  
  ngOnInit(): void {
    // Simula la carga de datos con un retraso
    setTimeout(() => {
      this.isLoading = false;
    }, 5000); // Ajusta el tiempo según sea necesario
 
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
