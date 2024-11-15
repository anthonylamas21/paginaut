import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ConvocatoriaService, Convocatoria } from '../convocatoria.service';
import Hashids from 'hashids';
import { filter } from 'rxjs/operators'; // Importar operador filter para detectar eventos de navegación
import { BASEIMAGEN } from '../constans';

@Component({
  selector: 'app-convocatorias',
  templateUrl: './convocatorias.component.html',
  styleUrls: ['./convocatorias.component.css']
})
export class ConvocatoriasComponent implements OnInit {
  isLoading = true;
  convocatoria: Convocatoria | null = null;
  convocatorias: Convocatoria[] = [];
  convocatoriasVisibles: Convocatoria[] = [];
  cantidadInicial = 5; // Mostrar inicialmente 5 convocatorias
  error: string | null = null;
  imagenAmpliada: string | null = null;
  idDecrypted: number | undefined;

  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 16);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private convocatoriaService: ConvocatoriaService
  ) {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      this.idDecrypted = this.hashids.decode(encryptedId)[0] as number;
    }

    // Detectar eventos de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Forzar la actualización del color del navbar después de un pequeño retraso
      setTimeout(() => {
        this.setNavbarColor();
      }, 10);
    });
  }

  ngOnInit(): void {
    this.setNavbarColor();

    if (this.idDecrypted !== undefined) {
      this.loadConvocatoria();
    } else {
      this.loadConvocatorias();
    }
  }


  loadConvocatoria(): void {
    this.convocatoriaService.obtenerConvocatoria(this.idDecrypted!).subscribe({
      next: (convocatoria: Convocatoria) => {
        this.convocatoria = convocatoria;
        this.isLoading = false;
      },
      error: (error: any) => {
        // console.error('Error al cargar la convocatoria:', error);
        this.error = 'No se pudieron cargar las convocatorias. Inténtalo más tarde.';
        this.isLoading = false;
      }
    });
  }

  loadConvocatorias(): void {
    this.convocatoriaService.obtenerConvocatorias().subscribe({
      next: (response) => {
        this.convocatorias = response.records;
        this.convocatoriasVisibles = this.convocatorias.slice(0, this.cantidadInicial);
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'No se pudieron cargar las convocatorias. Inténtalo más tarde.';
        this.isLoading = false;
      }
    });
  }

  verMasConvocatorias(): void {
    const newLimit = this.convocatoriasVisibles.length + this.cantidadInicial;
    this.convocatoriasVisibles = this.convocatorias.slice(0, newLimit);
  }

  verMenosConvocatorias(): void {
    // Asegurarse de que no se muestren menos de 5 convocatorias
    const newLimit = Math.max(this.convocatoriasVisibles.length - 5, 5);
    this.convocatoriasVisibles = this.convocatorias.slice(0, newLimit);
  }
  verConvocatoria(id: number): void {
    const encryptedId = this.hashids.encode(id);
    window.location.href = '/info-convocatoria/'+encryptedId;
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  getImageUrl(relativePath: string | undefined): string {
    if (!relativePath) {
      return 'assets/img/default-convocatoria-image.jpg'; // Imagen por defecto para convocatorias
    }
    const baseImageUrl = BASEIMAGEN+'/';
    if (relativePath.startsWith('../')) {
      return baseImageUrl + relativePath.substring(3);
    }
    return baseImageUrl + relativePath;
  }

  ampliarImagen(imagenUrl: string): void {
    this.imagenAmpliada = imagenUrl;
  }

  closeModal(): void {
    this.imagenAmpliada = null;
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
      nabvar.classList.add('bg-primary-color');
    }
  }
}
