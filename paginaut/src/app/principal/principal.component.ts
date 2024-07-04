import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Table,TableModule } from 'primeng/table';
import Swal from 'sweetalert2';
import { EventoService, Evento } from '../evento.service'; 

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})


export class PrincipalComponent implements OnInit {
  eventosRecientes: Evento[] = [];
  constructor(private eventoService: EventoService) {}

  ngOnInit() {
    this.cargarEventosRecientes();
  }

  cargarEventosRecientes(): void {
    this.eventoService.obtenerEventosRecientes().subscribe({
      next: (eventos) => {
        this.eventosRecientes = eventos.map(evento => ({
          ...evento,
          imagen_principal: this.getImageUrl(evento.imagen_principal || ''),
          imagenes_generales: (evento.imagenes_generales || []).map((img: string) => this.getImageUrl(img))
        }));
      },
      error: (error) => console.error('Error al cargar eventos recientes:', error)
    });
  }

  getImageUrl(relativePath: string): string {
    const baseImageUrl = 'http://localhost/paginaut/';
    if (relativePath && relativePath.startsWith('../')) {
      return baseImageUrl + relativePath.substring(3);
    }
    return baseImageUrl + relativePath;
  }
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const button = document.getElementById('scrollTopButton');
    const nabvar = document.getElementById('navbarAccion');
    const inicioSection = document.getElementById('inicio');
  
    if (inicioSection && nabvar) {
      const inicioSectionBottom = inicioSection.getBoundingClientRect().bottom;
  
      if (window.scrollY > inicioSectionBottom) {
        button?.classList.remove('hidden');
        nabvar.classList.remove('bg-transparent', 'transition-colors', 'duration-500');
        nabvar.classList.add('bg-[#043D3D]', 'transition-colors', 'duration-500');
      } else {
        button?.classList.add('hidden');
        nabvar.classList.remove('bg-[#043D3D]', 'transition-colors', 'duration-500');
        nabvar.classList.add('bg-transparent', 'transition-colors', 'duration-500');
      }
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

}
