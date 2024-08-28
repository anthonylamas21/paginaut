import { Component, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.component.html',
  styleUrl: './carreras.component.css'
})
export class CarrerasComponent {

  constructor(private renderer: Renderer2){}

  isLoading = true;
  
  carrerasAgropecuarias = [
    {
      title: 'Ingeniería en Agrobiotecnología',
      imageUrl: './assets/img/fotos_por_carrera/agrobiotecnologia.webp',
      link: 'info_carreras/agrobiotecnologia'
    },
    {
      title: 'Ingeniería en Procesos Alimentarios',
      imageUrl: './assets/img/fotos_por_carrera/procesos-alimenticios.webp',
      link: 'info_carreras/procesos-alimentario'
    },
    {
      title: 'Ingeniería en Acuicultura',
      imageUrl: './assets/img/fotos_por_carrera/acuicultura.webp',
      link: 'info_carreras/acuicultura'
    }
  ];

  carrerasNegocios = [
    {
      title: 'Licenciatura en Turismo',
      imageUrl: './assets/img/fotos_por_carrera/turismo.webp',
      link: 'info_carreras/turismo'
    },
    {
      title: 'Licenciatura en Administración',
      imageUrl: './assets/img/fotos_por_carrera/administracion.webp',
      link: 'info_carreras/administracion'
    },
    {
      title: 'Licenciatura en Mercadotecnia',
      imageUrl: './assets/img/fotos_por_carrera/mercadotecnia.webp',
      link: 'info_carreras/mercadotecnia'
    },
    {
      title: 'Licenciatura en Gastronomía',
      imageUrl: './assets/img/fotos_por_carrera/gastronomia.webp',
      link: 'info_carreras/gastronomia'
    },
    {
      title: 'TSU. en Contaduría',
      imageUrl: './assets/img/fotos_por_carrera/contaduria.webp',
      link: 'info_carreras/contaduria'
    }
  ];

  carrerasTecnologica = [
    {
      title: 'Ingeniería en Desarrollo y Gestión de Software',
      imageUrl: './assets/img/fotos_por_carrera/desarrollo-software.webp',
      link: 'info_carreras/desarrollo-software'
    }
  ];

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
