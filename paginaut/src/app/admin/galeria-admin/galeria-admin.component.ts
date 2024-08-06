import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-galeria-admin',
  templateUrl: './galeria-admin.component.html',
  styleUrls: ['./galeria-admin.component.css']
})
export class GaleriaAdminComponent {
  titulo: string = '';
  imagen: File | null = null;
  additionalImages: File[] = [];

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

  openModal() {
    const modal = document.getElementById('hs-slide-down-animation-modal-unidades-academicas');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex'); // Use 'flex' to make the modal visible
    }
  }

  closeModal() {
    const modal = document.getElementById('hs-slide-down-animation-modal-unidades-academicas');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  onFileSelected(event: any) {
    this.imagen = event.target.files[0];
  }

  addImageField() {
    this.additionalImages.push();
  }

  onAdditionalFileSelected(event: any, index: number) {
    this.additionalImages[index] = event.target.files[0];
  }

  editUnit() {
    // Implementar lógica de edición de unidad académica
  }

  saveChanges() {
    // Implementar lógica para guardar cambios
  }
}
