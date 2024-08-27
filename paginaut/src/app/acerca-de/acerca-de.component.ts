import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrl: './acerca-de.component.css'
})
export class AcercaDeComponent {

  programador = [
    {
      nombre: "Alexis Arath Alatorre Delgadillo", 
      foto:"./assets/img/acercade/AA.jpg", 
      especialidad: "Desarrollador Full Stack", 
      twitter:{active:true, links: [{ link: "https://twitter.com/alexis_arath" }]}, 
      github:{active:true, links: [{ link: "https://github.com/AlexisAlatorreD" }]}, 
      linkedn:{active:true, links: [{ link: "" }]}
    },
    {
      nombre: "Mario Imanol Mata Gómez", 
      foto:"./assets/img/acercade/MM.jpg", 
      especialidad: "Diseñador UI/UX", 
      twitter:{active:true, links: [{ link: "https://twitter.com/alexis_arath" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]}
    },
    {
      nombre: "Alberto Peña Ortíz", 
      foto:"./assets/img/acercade/AP.jpg", 
      especialidad: "Ingeniero de Software", 
      twitter:{active:true, links: [{ link: "https://twitter.com/alberto" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]}
    },
    {
      nombre: "Saul Hernández Contreras", 
      foto:"./assets/img/acercade/SH.png", 
      especialidad: "Administrador de Bases de Datos", 
      twitter:{active:true, links: [{ link: "https://twitter.com/saul" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]}
    },
    {
      nombre: "Yahir Nava Gandara", 
      foto:"./assets/img/acercade/YN.jpg", 
      especialidad: "Desarrollador Backend", 
      twitter:{active:true, links: [{ link: "https://twitter.com/aahir" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]}
    },
    {
      nombre: "Anthony Joseph Lamas Castillo", 
      foto:"./assets/img/acercade/AL.jpeg", 
      especialidad: "Especialista en Seguridad Informática", 
      twitter:{active:true, links: [{ link: "https://twitter.com/anthony" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]}
    },
    {
      nombre: "Cesar Geovanny Machuca Pereida", 
      foto:"./assets/img/perfil_vacio.png", 
      especialidad: "Analista de Datos", 
      twitter:{active:true, links: [{ link: "https://twitter.com/geovanny" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]}
    },
  ]
  
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

  isTwitterActive(hacker: any): boolean {
    return typeof hacker.twitter !== 'boolean' && hacker.twitter.active;
  }

  getTwitterLink(hacker: any): string {
    return hacker.twitter.links[0]?.link || '#';
  }

  isGithubActive(hacker: any): boolean {
    return typeof hacker.github !== 'boolean' && hacker.github.active;
  }

  getGithubLink(hacker: any): string {
    return hacker.github.links[0]?.link || '#';
  }

  isLinkednActive(hacker: any): boolean {
    return typeof hacker.linkedn !== 'boolean' && hacker.linkedn.active;
  }

  getLinkednLink(hacker: any): string {
    return hacker.linkedn.links[0]?.link || '#';
  }
}
