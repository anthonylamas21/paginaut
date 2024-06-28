import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-unidades-academicas',
  templateUrl: './unidades-academicas.component.html',
  styleUrl: './unidades-academicas.component.css'
})
export class UnidadesAcademicasComponent implements OnInit {
  isLoading = true;
  
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setNavbarColor();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'load', () => {
      this.isLoading = false;
    });
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
