import { Component, HostListener, OnInit } from '@angular/core';
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
    private bolsaDeTrabajoService: BolsaDeTrabajoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBolsa(Number(id));
      }
    });
    this.setNavbarColor();
  }

  loadBolsa(id: number): void {
    this.bolsaDeTrabajoService.getBolsaById(id).subscribe(
      (response: BolsaDeTrabajo) => {
        this.bolsa = response;
        console.log('Bolsa de trabajo recibida:', this.bolsa);
      },
      (error) => {
        console.error('Error al cargar la bolsa de trabajo:', error);
      }
    );
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
}
