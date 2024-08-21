import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BolsaDeTrabajo, BolsaDeTrabajoService } from '../admin/bolsa-de-trabajo.service';

@Component({
  selector: 'app-info-bolsa',
  templateUrl: './info-bolsa.component.html',
  styleUrls: ['./info-bolsa.component.css']
})
export class InfoBolsaComponent implements OnInit {
  bolsa?: BolsaDeTrabajo;

  constructor(
    private route: ActivatedRoute,
    private bolsaDeTrabajoService: BolsaDeTrabajoService
  ) {}

  ngOnInit(): void {
    this.loadBolsaDeTrabajo();
    this.setNavbarColor();
  }

  private loadBolsaDeTrabajo(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bolsaDeTrabajoService.getBolsaById(+id).subscribe({
        next: (data: BolsaDeTrabajo) => {
          this.bolsa = data;
        },
        error: (err) => {
          console.error('Error loading bolsa de trabajo:', err);
        }
      });
    }
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
