import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConvocatoriaService, Convocatoria } from '../convocatoria.service';
import Hashids from 'hashids';

@Component({
  selector: 'app-info-convocatoria',
  templateUrl: './info-convocatoria.component.html',
  styleUrls: ['./info-convocatoria.component.css']
})
export class InfoConvocatoriaComponent implements OnInit {

  isLoading = true;
  convocar: Convocatoria | null = null;
  error: string | null = null;
  imagenAmpliada: string | null = null;

  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 16);
  idDecrypted: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: ConvocatoriaService
  ) {
    // Desencriptar el ID en el constructor
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      this.idDecrypted = this.hashids.decode(encryptedId)[0] as number;
      console.log(this.idDecrypted);
    } else {
      console.log('ID de la convocatoria no disponible');
    }
  }

  ngOnInit(): void {
    this.setNavbarColor();
    this.loadEvento();
  }

  loadEvento(): void {
    if (this.idDecrypted !== undefined) {
      this.eventoService.GetConvocatorias(this.idDecrypted).subscribe({
        next: (evento: Convocatoria) => {
          this.convocar = evento;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error al cargar la convocatoria:', error);
          this.error = 'No se pudo cargar el convocatoria. Por favor, inténtalo de nuevo más tarde.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'No se especificó un ID de convocatoria válido.';
      this.isLoading = false;
    }
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  getImageUrl(relativePath: string | undefined): string {
    if (!relativePath) {
      return 'assets/img/default-event-image.jpg'; // Asegúrate de tener una imagen por defecto
    }
    const baseImageUrl = 'http://localhost/paginaut/';
    if (relativePath.startsWith('../')) {
      return baseImageUrl + relativePath.substring(3);
    }
    return baseImageUrl + relativePath;
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

  ampliarImagen(imagenUrl: string): void {
    this.imagenAmpliada = imagenUrl;
  }

  closeModal(): void {
    const modal = document.getElementById('hs-vertically-centered-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('pointer-events-auto');
    }
    this.imagenAmpliada = null;
  }
}