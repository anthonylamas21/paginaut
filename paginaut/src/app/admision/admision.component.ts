import { Component, HostListener } from '@angular/core';
import { BolsaDeTrabajo, BolsaDeTrabajoService } from '../admin/bolsa-de-trabajo.service';
import Hashids from 'hashids';

@Component({
  selector: 'app-admision',
  templateUrl: './admision.component.html',
  styleUrl: './admision.component.css'
})
export class AdmisionComponent {
  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 16);

  isLoading = true;
  searchText: string = '';
  bolsas: BolsaDeTrabajo[] = [];
  filteredBolsas: BolsaDeTrabajo[] = [];
  getrequisitos?: Array<{ requisito: string }>;

  constructor(private bolsaDeTrabajoService: BolsaDeTrabajoService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.loadInactiveBolsas();
      this.isLoading = false;
    }, 1000);
    this.setNavbarColor();
  }

  // Filtrar las bolsas de trabajo
  filterBolsas() {
    if (this.searchText) {
      this.filteredBolsas = this.bolsas.filter(bolsa =>
        bolsa.nombre_empresa.toLowerCase().includes(this.searchText.toLowerCase()) ||
        bolsa.descripcion_trabajo.toLowerCase().includes(this.searchText.toLowerCase()) ||
        bolsa.puesto_trabajo.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredBolsas = [...this.bolsas]; // Mostrar todas las bolsas si no hay texto de búsqueda
    }
  }

  verDetalleBolsa(id: number | undefined): void {
    if (id) {
      const encryptedId = this.hashids.encode(id);
      window.location.href = '/info_bolsa/' + encryptedId;
    } else {
      console.error('ID del curso no disponible');
    }
  }
  // OBTENER INFORMACION

  loadInactiveBolsas() {
    this.bolsaDeTrabajoService.getActiveBolsas().subscribe(
      (response: any) => {
        this.bolsas = response.records;
        this.filteredBolsas = [...this.bolsas]; // Inicializar la lista filtrada con todas las bolsas inactivas
        console.log('Bolsas de trabajo activas recibidas:', this.bolsas);
  
        // Cargar los requisitos para cada bolsa de trabajo inactiva si es necesario
        this.bolsas.forEach((bolsa: BolsaDeTrabajo) => {
          this.loadRequisitosBolsa(bolsa);
        });
      },
      (error) => {
        console.error('Error al cargar bolsas de trabajo inactivas:', error);
      }
    );
  }
  

  loadRequisitosBolsa(bolsaTrabajo: BolsaDeTrabajo) {
    const id = bolsaTrabajo.id;
    if (id && typeof id === 'number') {
      this.bolsaDeTrabajoService.getRequisitos(id).subscribe(
        (response) => {
          bolsaTrabajo.requisitos = response.details;
          console.log(`Requisitos recibidos para la bolsa con ID ${id}:`, bolsaTrabajo.requisitos);
        },
        (error) => {
          console.error('Error al cargar requisitos:', error);
        }
      );
    } else {
      console.error('ID no es un número:', id);
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
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
}

