import { Component,HostListener } from '@angular/core';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrl: './ubicacion.component.css'
})
export class UbicacionComponent {

  isOpen: boolean = false;
  currentTime: Date = new Date();
  
  ngOnInit(): void {
    this.setNavbarColor();
    this.checkOpeningHours();
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

  checkOpeningHours() {
    const day = this.currentTime.getDay(); // 0 (Sunday) to 6 (Saturday)
    const hours = this.currentTime.getHours(); // 0 to 23

    // Set opening hours
    const openingHours = {
      weekday: { open: 8, close: 16 }, // Monday to Friday
      saturday: { open: 8, close: 17.5 }, // Saturday
      sunday: { open: 0, close: 0 } // Sunday (Closed)
    };

    if (day >= 1 && day <= 5) { // Monday to Friday
      this.isOpen = hours >= openingHours.weekday.open && hours < openingHours.weekday.close;
    } else if (day === 6) { // Saturday
      this.isOpen = hours >= openingHours.saturday.open && hours < openingHours.saturday.close;
    } else { // Sunday
      this.isOpen = false;
    }
  }
}
