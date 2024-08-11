import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-admision',
  templateUrl: './admision.component.html',
  styleUrl: './admision.component.css'
})
export class AdmisionComponent {

  
  ngOnInit(): void {
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

  //FILTRAR LA BOLSA DE TRABAJO
  searchText: string = '';
  jobs = [
    { title: 'Asistente de Investigación en Biotecnología', requirements: ['Experiencia en redes', '5 años de experiencia laboral', 'Inglés'] },
    { title: 'Desarrollador de Software para Proyectos Académicos', requirements: ['Experiencia en redes', '5 años de experiencia laboral', 'Inglés'] },
    { title: 'Analista de Datos en Ciencias Sociales', requirements: ['Experiencia en redes', '5 años de experiencia laboral', 'Inglés'] },
    { title: 'Asistente Administrativo en la Facultad de Derecho', requirements: ['Experiencia en redes', '5 años de experiencia laboral', 'Inglés'] },
  ];

  filteredJobs = [...this.jobs];

  filterJobs() {
    this.filteredJobs = this.jobs.filter(job => 
      job.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
