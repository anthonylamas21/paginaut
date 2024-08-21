import { Component, HostListener } from '@angular/core';
import { BolsaDeTrabajo, BolsaDeTrabajoService } from '../admin/bolsa-de-trabajo.service';

@Component({
  selector: 'app-admision',
  templateUrl: './admision.component.html',
  styleUrl: './admision.component.css'
})
export class AdmisionComponent {

  isLoading = true;
  searchText: string = '';
  bolsas: BolsaDeTrabajo[] = [];
  filteredBolsas: BolsaDeTrabajo[] = [];
  getrequisitos?: Array<{ requisito: string }>;

  constructor(private bolsaDeTrabajoService: BolsaDeTrabajoService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.loadBolsas();
      this.isLoading = false;
    }, 2000);
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

  // OBTENER INFORMACION
  loadBolsas() {
    this.bolsaDeTrabajoService.getBolsas().subscribe(
      (response: any) => {
        this.bolsas = response.records;
        this.filteredBolsas = [...this.bolsas]; // Inicializar la lista filtrada con todas las bolsas
        console.log('Bolsas de trabajo recibidas:', this.bolsas);

        // Cargar los requisitos para cada bolsa de trabajo
        this.bolsas.forEach((bolsa: BolsaDeTrabajo) => {
          this.loadRequisitosBolsa(bolsa);
        });
      },
      (error) => {
        console.error('Error al cargar bolsas de trabajo:', error);
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

