import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CalendarioService, Calendario } from '../admin/calendario.service';
import { BASEIMAGEN } from '../constans';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
})
export class CalendarioComponent implements OnInit {
  pdfUrl: SafeResourceUrl | undefined;
  isLoading: boolean= false;

  constructor(
    private calendarioService: CalendarioService,
    private sanitizer: DomSanitizer
  ) {}

  
  ngOnInit(): void {
    this.setNavbarColor();
    this.loadPdfUrl();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }

  private setNavbarColor(): void {
    const button = document.getElementById('scrollTopButton');
    const navbar = document.getElementById('navbarAccion');
    const inicioSection = document.getElementById('inicio');

    if (inicioSection && navbar) {
      const inicioSectionBottom = inicioSection.getBoundingClientRect().bottom;

      if (window.scrollY > inicioSectionBottom) {
        button?.classList.remove('hidden');
      } else {
        button?.classList.add('hidden');
      }

      navbar.classList.remove('bg-transparent');
      navbar.classList.add('bg-[#043D3D]');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  private loadPdfUrl(): void {
    this.calendarioService.getCalendarios().subscribe({
      next: (response: any) => {
        if (response.records && Array.isArray(response.records)) {
          const calendarios: Calendario[] = response.records;
          const activeCalendario = calendarios.find((cal) => cal.activo);
          if (activeCalendario) {
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              BASEIMAGEN + `${activeCalendario.archivo}`
            );
            console.log(response);
            this.isLoading = true;
          } else {
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }
}