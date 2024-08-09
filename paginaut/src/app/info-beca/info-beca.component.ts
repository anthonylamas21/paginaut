import { Component, OnInit, AfterViewInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BecaService, Beca } from '../admin/beca.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-info-beca',
  templateUrl: './info-beca.component.html',
  styleUrls: ['./info-beca.component.css']
})
export class InfoBecaComponent implements OnInit, AfterViewInit {
  beca: Beca | null = null;
  error: string | null = null;
  safeArchivoUrl: SafeResourceUrl | null = null;
  documentoExistente: boolean = false;
  private baseUrl = 'http://localhost/paginaut/';
  isLoading = true;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private becaService: BecaService,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer, private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarDetalleBeca();
    this.setNavbarColor();
  }

  verificarUrl(url: string): void {
    this.http.head(url, { observe: 'response' }).subscribe(response => {
      if (response.status === 200) {
        this.safeArchivoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.safeArchivoUrl = true;
      } else {
        this.safeArchivoUrl = false;
      }
    }, () => {
      this.safeArchivoUrl = false;
    });
  }

  ngAfterViewInit(): void {
    // Asegurarse de que el navbar se coloree después de que la vista se haya inicializado
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
      this.renderer.addClass(navbar, 'bg-[#043D3D]');
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.becaService.getBecaById(Number(id)).subscribe({
        next: (beca) => {
          this.beca = beca;
          this.actualizarSafeArchivoUrl();
        },
        error: (error) => {
          console.error('Error al cargar el detalle de la beca:', error);
          this.error = 'No se pudo cargar el detalle de la beca. Por favor, intente más tarde.';
        }
      });
    }
  }

  private actualizarSafeArchivoUrl(): void {
    if (this.beca && this.beca.archivo) {
      const fullUrl = this.getFullUrl(this.beca.archivo);
      console.log('URL completa del archivo:', fullUrl); // Log para depuración
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