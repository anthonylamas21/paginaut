import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BolsaDeTrabajo, BolsaDeTrabajoService } from '../admin/bolsa-de-trabajo.service';
import Hashids from 'hashids';

@Component({
  selector: 'app-info-bolsa',
  templateUrl: './info-bolsa.component.html',
  styleUrls: ['./info-bolsa.component.css']
})
export class InfoBolsaComponent implements OnInit, AfterViewInit {

  bolsa?: BolsaDeTrabajo;
  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 16);
  idDecrypted: number | undefined;

  constructor(
    private bolsaDeTrabajoService: BolsaDeTrabajoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      this.idDecrypted = this.hashids.decode(encryptedId)[0] as number;
    } else {
      // console.error('ID de beca no disponible');
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encryptedId = params.get('id');
      if (encryptedId) {
        const id = this.hashids.decode(encryptedId)[0] as number;
        if (id) {
          this.loadBolsa(id);
        } else {
          // console.error('ID de bolsa de trabajo no válido');
          this.redirectToNotFound();
        }
      }else{
        this.redirectToNotFound();
      }
    });
    this.setNavbarColor();
  }
  
  ngAfterViewInit(): void {}

  private redirectToNotFound(): void {
    this.router.navigate(['/not-found']);
  }

  loadBolsa(id: number): void {
    this.bolsaDeTrabajoService.getBolsaById(id).subscribe(
      (response: BolsaDeTrabajo) => {
        this.bolsa = response;
        // console.log('Bolsa de trabajo recibida:', this.bolsa);
      },
      (error) => {
        // console.error('Error al cargar la bolsa de trabajo:', error);
      }
    );
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
