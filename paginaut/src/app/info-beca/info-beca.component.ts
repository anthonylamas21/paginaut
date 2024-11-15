import { Component, OnInit, AfterViewInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BecaService, Beca } from '../admin/beca.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Hashids from 'hashids';
import { BASEIMAGEN } from '../constans';

@Component({
  selector: 'app-info-beca',
  templateUrl: './info-beca.component.html',
  styleUrls: ['./info-beca.component.css']
})
export class InfoBecaComponent implements OnInit, AfterViewInit {

  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 16);
  idDecrypted: number | undefined;

  beca: Beca | null = null;
  error: string | null = null;
  safeArchivoUrl: SafeResourceUrl | null = null;
  archivoDisponible: boolean = false;
  private baseUrl = BASEIMAGEN+'/';
  isLoading = true;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private becaService: BecaService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef
  ) {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      this.idDecrypted = this.hashids.decode(encryptedId)[0] as number;
    } else {
      // console.error('ID de beca no disponible');
    }
  }

  ngOnInit(): void {
    this.cargarDetalleBeca();
    this.setNavbarColor();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setNavbarColor();
      this.isLoading = false;
      this.cdRef.detectChanges();
    }, 0);
  }

  private setNavbarColor(): void {
    const navbar = document.getElementById('navbarAccion');
    if (navbar) {
      this.renderer.removeClass(navbar, 'bg-transparent');
      this.renderer.addClass(navbar, 'bg-primary-color');
      this.renderer.setStyle(navbar, 'position', 'fixed');
      this.renderer.setStyle(navbar, 'top', '0');
      this.renderer.setStyle(navbar, 'left', '0');
      this.renderer.setStyle(navbar, 'right', '0');
      this.renderer.setStyle(navbar, 'z-index', '1000');
    }

    const button = document.getElementById('scrollTopButton');
    if (button) {
      this.renderer.addClass(button, 'hidden');
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  cargarDetalleBeca(): void {
    if (this.idDecrypted !== undefined) {
      this.becaService.getBecaById(this.idDecrypted).subscribe({
        next: (beca) => {
          this.beca = beca;
          this.actualizarSafeArchivoUrl();
          this.isLoading = false;
        },
        error: (error) => {
          // console.error('Error al cargar el detalle de la beca:', error);
          this.error = 'No se pudo cargar el detalle de la beca. Por favor, intente más tarde.';
        }
      });
    } else {
      // console.error('ID de beca no disponible');
    }
  }

  private actualizarSafeArchivoUrl(): void {
    if (this.beca && this.beca.archivo) {
      const fullUrl = this.getFullUrl(this.beca.archivo);
      // console.log('URL completa del archivo:', fullUrl); // Log para depuración
      this.safeArchivoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    } else {
      this.safeArchivoUrl = null;
    }
  }

  private getFullUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${this.baseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
  }

  get nombreBeca(): string {
    return this.beca?.nombre ?? 'Beca no disponible';
  }

  get descripcionBeca(): string {
    return this.beca?.descripcion ?? 'Descripción no disponible';
  }

  get archivoBeca(): string | null {
    return this.beca?.archivo ? this.getFullUrl(this.beca.archivo) : null;
  }
}
