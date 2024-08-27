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
      especialidad: "Scrum Master", 
      twitter:{active:true, links: [{ link: "https://x.com/Alexis_alat" }]}, 
      github:{active:true, links: [{ link: "https://github.com/AlexisAlatorreD" }]}, 
      linkedn:{active:true, links: [{ link: "https://www.linkedin.com/in/alexis-alatorre-delgadillo-0952aa236/" }]},
      Instagram:{active:false, links: [{ link: "" }]}
    },
    {
      nombre: "Mario Imanol Mata Gómez", 
      foto:"./assets/img/acercade/MM.jpg", 
      especialidad: "Programador Backend", 
      twitter:{active:false, links: [{ link: "" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]},
      Instagram:{active:false, links: [{ link: "" }]}
    },
    {
      nombre: "Alberto Peña Ortíz", 
      foto:"./assets/img/acercade/AP.jpg", 
      especialidad: "Diseñador UX", 
      twitter:{active:true, links: [{ link: "https://twitter.com/alberto" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]},
      Instagram:{active:true, links: [{ link: "" }]}
    },
    {
      nombre: "Saul Hernández Contreras", 
      foto:"./assets/img/acercade/SH.png", 
      especialidad: "Analista", 
      twitter:{active:false, links: [{ link: "" }]}, 
      github:{active:true, links: [{ link: "https://github.com/saulhdez25" }]}, 
      linkedn:{active:true, links: [{ link: "https://www.linkedin.com/in/saul-hern%C3%A1ndez-b750a8319/" }]},
      Instagram:{active:false, links: [{ link: "" }]}
    },
    {
      nombre: "Yahir Nava Gandara", 
      foto:"./assets/img/acercade/YN.jpg", 
      especialidad: "Diseñador UI", 
      twitter:{active:true, links: [{ link: "https://twitter.com/aahir" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]},
      Instagram:{active:true, links: [{ link: "" }]}
    },
    {
      nombre: "Anthony Joseph Lamas Castillo", 
      foto:"./assets/img/acercade/AL.jpeg", 
      especialidad: "Programador FrontEnd", 
      twitter:{active:true, links: [{ link: "https://twitter.com/anthony" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]},
      Instagram:{active:true, links: [{ link: "" }]}
    },
    {
      nombre: "Cesar Geovanny Machuca Pereida", 
      foto:"./assets/img/perfil_vacio.png", 
      especialidad: "Profesor de 10", 
      twitter:{active:true, links: [{ link: "https://twitter.com/geovanny" }]}, 
      github:{active:true, links: [{ link: "" }]}, 
      linkedn:{active:true, links: [{ link: "" }]},
      Instagram:{active:true, links: [{ link: "" }]}
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

  isInstagramActive(hacker: any): boolean {
    return typeof hacker.Instagram !== 'boolean' && hacker.Instagram.active;
  }

  getInstagramLink(hacker: any): string {
    return hacker.Instagram.links[0]?.link || '#';
  }
}
