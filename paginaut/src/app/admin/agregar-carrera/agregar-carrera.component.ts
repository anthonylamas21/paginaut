import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarreraService, Carrera } from '../carrera.service';
import { DireccionService, Direccion } from '../../direccion.service';
import Swal from 'sweetalert2';

class TooltipManager {
  static adjustTooltipPosition(
    button: HTMLElement,
    tooltip: HTMLElement
  ): void {
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const preferredLeft =
      buttonRect.left - tooltipRect.width / 2 + buttonRect.width / 2;
    const preferredTop = buttonRect.top - tooltipRect.height - 10;

    let left = Math.max(preferredLeft, 0);
    let top = Math.max(preferredTop, 0);

    if (left + tooltipRect.width > windowWidth) {
      left = windowWidth - tooltipRect.width;
    }

    if (top + tooltipRect.height > windowHeight) {
      top = windowHeight - tooltipRect.height;
    }

    tooltip.style.position = 'fixed';
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }
}

@Component({
  selector: 'app-agregar-carrera',
  templateUrl: './agregar-carrera.component.html',
  styleUrls: ['./agregar-carrera.component.css'],
})
export class AgregarCarreraComponent implements OnInit {
  carreraForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  isViewModalOpen: boolean = false;
  carreras: Carrera[] = [];
  direcciones: Direccion[] = [];
  filteredCarreras: Carrera[] = [];
  papeleraCarreras: Carrera[] = [];
  currentCarreraId?: number;
  currentCarrera?: Carrera;
  selectedCarrera?: Carrera;
  currentTab: 'active' | 'inactive' = 'active';

  constructor(
    private fb: FormBuilder,
    private carreraService: CarreraService,
    private direccionService: DireccionService
  ) {
    this.carreraForm = this.fb.group({
      nombre_carrera: ['', [Validators.required, Validators.maxLength(100)]],
      perfil_profesional: ['', [Validators.maxLength(500)]],
      ocupacion_profesional: ['', [Validators.maxLength(500)]],
      direccion_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCarreras();
    this.loadDirecciones();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
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

  onSubmit() {
    if (this.carreraForm.valid) {
      const formData: Carrera = {
        id: this.currentCarreraId,
        nombre_carrera: this.carreraForm.get('nombre_carrera')?.value,
        perfil_profesional: this.carreraForm.get('perfil_profesional')?.value,
        ocupacion_profesional: this.carreraForm.get('ocupacion_profesional')
          ?.value,
        direccion_id: this.carreraForm.get('direccion_id')?.value,
        activo: true,
      };

      this.carreraService.saveCarrera(formData).subscribe({
        next: (response: any) => {
          this.showToast(
            'success',
            this.currentCarreraId
              ? 'Carrera actualizada correctamente'
              : 'Carrera agregada correctamente'
          );
          this.loadCarreras();
          this.resetForm();
          this.closeModal();
        },
        error: (error: any) => {
          this.showToast('error', error.message);
        },
      });
    } else {
      this.showToast(
        'warning',
        'Por favor, completa todos los campos requeridos.'
      );
    }
  }

  resetForm() {
    this.carreraForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentCarreraId = undefined;
    this.currentCarrera = undefined;
  }

  openModal(carrera?: Carrera) {
    if (carrera) {
      this.currentCarreraId = carrera.id;
      this.carreraForm.patchValue({
        nombre_carrera: carrera.nombre_carrera,
        perfil_profesional: carrera.perfil_profesional,
        ocupacion_profesional: carrera.ocupacion_profesional,
        direccion_id: carrera.direccion_id,
      });
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openViewModal(carrera: Carrera) {
    this.selectedCarrera = carrera;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
  }

  loadCarreras() {
    this.carreraService.getCarreras().subscribe({
      next: (response: any) => {
        this.carreras = response.records;
        this.filterCarreras();
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  loadDirecciones() {
    this.direccionService.getDirecciones().subscribe({
      next: (response: any) => {
        this.direcciones = response.records;
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  moveToTrash(id: number) {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres enviar esta carrera a la papelera?',
      () => {
        this.carreraService.updateCarreraStatus(id, false).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Carrera enviada a la papelera');
            this.loadCarreras();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  restoreCarrera(id: number) {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres restaurar esta carrera?',
      () => {
        this.carreraService.updateCarreraStatus(id, true).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Carrera restaurada');
            this.loadCarreras();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  deleteCarrera(id: number) {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres eliminar esta carrera? Esta acción no se puede deshacer.',
      () => {
        this.carreraService.deleteCarrera(id).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Carrera eliminada correctamente');
            this.loadCarreras();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  filterCarreras() {
    const value = '';
    if (this.currentTab === 'active') {
      this.filteredCarreras = this.carreras.filter(
        (carrera) =>
          carrera.activo &&
          (carrera.nombre_carrera.toLowerCase().includes(value) ||
            (carrera.perfil_profesional &&
              carrera.perfil_profesional.toLowerCase().includes(value)) ||
            (carrera.ocupacion_profesional &&
              carrera.ocupacion_profesional.toLowerCase().includes(value)) ||
            (carrera.fecha_creacion && carrera.fecha_creacion.includes(value)))
      );
    } else {
      this.papeleraCarreras = this.carreras.filter(
        (carrera) =>
          !carrera.activo &&
          (carrera.nombre_carrera.toLowerCase().includes(value) ||
            (carrera.perfil_profesional &&
              carrera.perfil_profesional.toLowerCase().includes(value)) ||
            (carrera.ocupacion_profesional &&
              carrera.ocupacion_profesional.toLowerCase().includes(value)) ||
            (carrera.fecha_creacion && carrera.fecha_creacion.includes(value)))
      );
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterCarreras();
  }

  mostrar(elemento: any): void {
    if (elemento.tagName.toLowerCase() === 'button') {
      const tooltipElement = elemento.querySelector('.hs-tooltip');
      if (tooltipElement) {
        tooltipElement.classList.toggle('show');
        const tooltipContent = tooltipElement.querySelector(
          '.hs-tooltip-content'
        );
        if (tooltipContent) {
          tooltipContent.classList.toggle('hidden');
          tooltipContent.classList.toggle('invisible');
          tooltipContent.classList.toggle('visible');
          TooltipManager.adjustTooltipPosition(elemento, tooltipContent);
        }
      }
    }
  }

  private showToast(
    icon: 'success' | 'warning' | 'error' | 'info' | 'question',
    title: string
  ): void {
    const Toast = Swal.mixin({
      toast: true,iconColor: '#008779',
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: icon,
      title: title,
    });
  }

  private showConfirmDialog(
    title: string,
    text: string,
    onConfirm: () => void
  ): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }
}
