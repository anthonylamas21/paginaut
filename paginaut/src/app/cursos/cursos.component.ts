import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent {

  isLoading = true;
  searchTerm: string = '';  // Término de búsqueda ingresado por el usuario
  cursos: Array<{ title: string, description: string, image: string }> = [];  // Arreglo de todos los cursos
  filteredCursos: Array<{ title: string, description: string, image: string }> = [];  // Arreglo de cursos filtrados


  ngOnInit(): void {
    // Simulación de carga de datos (puedes reemplazar esto con una llamada a un servicio)
    setTimeout(() => {
      this.cursos = [
        {
          title: 'Inglés Básico',
          description: 'Aprende inglés de manera efectiva con nuestras clases sabatinas, diseñadas para niños, adolescentes y adultos.',
          image: './assets/img/BANNER INGLES ADULTO E INFANTIL.jpg'
        },
        {
          title: 'TOEFL Preparation',
          description: 'Prepárate para el examen TOEFL con nuestros cursos intensivos diseñados para mejorar tu puntuación.',
          image: './assets/img/TOELF.jpg'
        },
        {
          title: 'Inglés Avanzado',
          description: 'Perfecciona tu inglés con nuestras clases avanzadas, enfocadas en conversación y comprensión lectora.',
          image: './assets/img/CLENN.jpg'
        },
        {
          title: 'Curso de Conversación',
          description: 'Mejora tu fluidez en inglés con nuestros cursos de conversación enfocados en situaciones reales.',
          image: './assets/img/TOELF.jpg'
        }
      ];
      this.filteredCursos = this.cursos;  // Inicialmente muestra todos los cursos
      this.isLoading = false;  // Detener la animación de carga
    }, 2000);  // Simulación de un retraso de 2 segundos
    this.setNavbarColor();
  }

  // Método para filtrar cursos basado en el término de búsqueda
  filterCursos(): void {
    this.filteredCursos = this.cursos.filter(curso => 
      curso.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      curso.description.toLowerCase().includes(this.searchTerm.toLowerCase())
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
