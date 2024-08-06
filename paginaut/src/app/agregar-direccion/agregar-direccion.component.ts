import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DireccionService, Direccion } from '../direccion.service';
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
  selector: 'app-agregar-direccion',
  templateUrl: './agregar-direccion.component.html',
  styleUrls: ['./agregar-direccion.component.css'],
})
export class AgregarDireccionComponent implements OnInit {
  direccionForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  isViewModalOpen: boolean = false; // Añadido esta línea
  direcciones: Direccion[] = [];
  filteredDirecciones: Direccion[] = [];
  papeleraDirecciones: Direccion[] = [];
  currentDireccionId?: number;
  currentDireccion?: Direccion;
  selectedDireccion?: Direccion;
  currentTab: 'active' | 'inactive' = 'active';

  constructor(
    private fb: FormBuilder,
    private direccionService: DireccionService,
    private renderer: Renderer2
  ) {
    this.direccionForm = this.fb.group({
      abreviatura: ['', [Validators.required, Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.loadDirecciones();
    this.setNavbarColor();
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

  onSubmit() {
    if (this.direccionForm.valid) {
      const formData: FormData = new FormData();
      formData.append(
        'abreviatura',
        this.direccionForm.get('abreviatura')?.value
      );
      formData.append('nombre', this.direccionForm.get('nombre')?.value);

      if (this.currentDireccionId) {
        formData.append('id', this.currentDireccionId.toString());
        this.direccionService.updateDireccion(formData).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Dirección actualizada correctamente');
            this.loadDirecciones();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      } else {
        this.direccionService.addDireccion(formData).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Dirección agregada correctamente');
            this.loadDirecciones();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    } else {
      this.showToast(
        'warning',
        'Por favor, completa todos los campos requeridos.'
      );
    }
  }

  validateInput(event: KeyboardEvent) {
    const allowedKeys = /^[a-zA-Z0-9\s]*$/;
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }
  }

  resetForm() {
    this.direccionForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentDireccionId = undefined;
    this.currentDireccion = undefined;
  }

  openModal(direccion?: Direccion) {
    if (direccion) {
      this.currentDireccionId = direccion.id;
      this.currentDireccion = direccion;
      this.direccionForm.patchValue({
        abreviatura: direccion.abreviatura,
        nombre: direccion.nombre,
      });
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadDirecciones() {
    this.direccionService.getDirecciones().subscribe({
      next: (response: any) => {
        this.direcciones = response.records;
        this.filterDirecciones();
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  deleteDireccion(id: number) {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres eliminar esta dirección? Esta acción no se puede deshacer.',
      () => {
        this.direccionService.deleteDireccion(id).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Dirección eliminada correctamente');
            this.loadDirecciones();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  moveToTrash(id: number) {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres mover esta dirección a la papelera?',
      () => {
        this.direccionService.updateDireccionStatus(id, false).subscribe({
          next: (response: any) => {
            this.showToast(
              'success',
              'Dirección movida a la papelera correctamente'
            );
            this.loadDirecciones();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  activateDireccion(id: number) {
    const direccionToUpdate = this.direcciones.find(
      (direccion) => direccion.id === id
    );
    if (direccionToUpdate) {
      direccionToUpdate.activo = true;
      const formData: FormData = new FormData();
      formData.append('id', direccionToUpdate.id!.toString());
      formData.append('abreviatura', direccionToUpdate.abreviatura);
      formData.append('nombre', direccionToUpdate.nombre);
      formData.append('activo', 'true');
      this.direccionService.updateDireccion(formData).subscribe({
        next: (response: any) => {
          this.showToast('success', 'Dirección activada correctamente');
          this.loadDirecciones();
        },
        error: (error: any) => {
          this.showToast('error', error.message);
        },
      });
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterDirecciones();
  }

  filterDirecciones() {
    if (this.currentTab === 'active') {
      this.filteredDirecciones = this.direcciones.filter(
        (direccion) => direccion.activo
      );
    } else {
      this.papeleraDirecciones = this.direcciones.filter(
        (direccion) => !direccion.activo
      );
    }
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.currentTab === 'active') {
      this.filteredDirecciones = this.direcciones.filter(
        (direccion) =>
          direccion.activo &&
          (direccion.abreviatura.toLowerCase().includes(value) ||
            direccion.nombre.toLowerCase().includes(value) ||
            (direccion.fecha_creacion &&
              direccion.fecha_creacion.includes(value)))
      );
    } else {
      this.papeleraDirecciones = this.direcciones.filter(
        (direccion) =>
          !direccion.activo &&
          (direccion.abreviatura.toLowerCase().includes(value) ||
            direccion.nombre.toLowerCase().includes(value) ||
            (direccion.fecha_creacion &&
              direccion.fecha_creacion.includes(value)))
      );
    }
  }

  viewDireccion(direccion: Direccion) {
    this.selectedDireccion = direccion;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
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
      toast: true,
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
