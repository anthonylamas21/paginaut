import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CalendarioService, Calendario } from '../calendario.service';
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
  selector: 'app-agregar-calendario',
  templateUrl: './agregar-calendario.component.html',
  styleUrls: ['./agregar-calendario.component.css'],
})
export class AgregarCalendarioComponent implements OnInit {
  calendarioForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  isViewModalOpen: boolean = false;
  calendarios: Calendario[] = [];
  filteredCalendarios: Calendario[] = [];
  papeleraCalendarios: Calendario[] = [];
  currentCalendarioId?: number;
  currentCalendario?: Calendario;
  selectedCalendario?: Calendario;
  currentTab: 'active' | 'inactive' = 'active';
  fileToUpload: File | null = null;
  currentFileName: string = '';
  hasActiveCalendario: boolean = false;
  baseImageUrl = 'http://localhost/paginaut/';

  constructor(
    private fb: FormBuilder,
    private calendarioService: CalendarioService,
    public sanitizer: DomSanitizer
  ) {
    this.calendarioForm = this.fb.group({
      anio: ['', [Validators.required, Validators.maxLength(4)]],
      titulo: [{ value: '', disabled: true }],
      archivo: [''],
    });
  }

  ngOnInit() {
    this.loadCalendarios();
  }

  onSubmit() {
    if (this.calendarioForm.valid) {
      const formData: FormData = new FormData();
      formData.append('titulo', this.calendarioForm.get('titulo')?.value);
      if (this.fileToUpload) {
        formData.append('archivo', this.fileToUpload, this.fileToUpload.name);
      } else {
        formData.append('archivo', this.currentFileName);
      }

      if (this.currentCalendarioId) {
        formData.append('id', this.currentCalendarioId.toString());
        this.calendarioService.updateCalendario(formData).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Calendario actualizado correctamente');
            this.loadCalendarios();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      } else {
        this.calendarioService.addCalendario(formData).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Calendario agregado correctamente');
            this.loadCalendarios();
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.fileToUpload = file;
    } else {
      this.calendarioForm.get('archivo')?.setErrors({ invalidFileType: true });
      this.showToast('error', 'Solo se permiten archivos en formato PDF.');
      this.fileToUpload = null;
    }
  }

  validateInput(event: KeyboardEvent) {
    const allowedKeys = /^[0-9]*$/;
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }
  }

  resetForm() {
    this.calendarioForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentCalendarioId = undefined;
    this.currentCalendario = undefined;
    this.currentFileName = '';
    this.fileToUpload = null;
  }

  openModal(calendario?: Calendario) {
    if (calendario) {
      this.currentCalendarioId = calendario.id;
      this.currentCalendario = calendario;
      this.currentFileName = calendario.archivo;
      this.calendarioForm.patchValue({
        anio: calendario.titulo.replace('Calendario Escolar ', ''),
      });
      this.updateTitulo();
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openViewModal(calendario: Calendario) {
    this.selectedCalendario = calendario;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
  }

  loadCalendarios() {
    this.calendarioService.getCalendarios().subscribe({
      next: (response: any) => {
        this.calendarios = response.records;
        this.hasActiveCalendario = this.calendarios.some((cal) => cal.activo);
        this.filterCalendarios();
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  deleteCalendario(id: number) {
    this.showConfirmDialog(
      'Eliminar calendario',
      'Esta acción eliminará permanentemente el calendario seleccionado. No podrás recuperarlo. ¿Estás seguro de que deseas continuar?',
      () => {
        this.calendarioService.deleteCalendario(id).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Calendario eliminado correctamente');
            this.loadCalendarios();
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
      'Mover a papelera',
      'Este calendario será movido a la papelera. Podrás restaurarlo más tarde si lo deseas. ¿Quieres mover este calendario a la papelera?',
      () => {
        this.calendarioService.updateCalendarioStatus(id, false).subscribe({
          next: (response: any) => {
            this.showToast(
              'success',
              'Calendario movido a la papelera correctamente'
            );
            this.loadCalendarios();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  activateCalendario(id: number) {
    const calendarioToUpdate = this.calendarios.find((cal) => cal.id === id);

    if (calendarioToUpdate && calendarioToUpdate.id !== undefined) {
      if (this.papeleraCalendarios.length > 2) {
        this.showConfirmDialog(
          'Confirmar activación de calendario',
          `Tienes más de dos calendarios en la papelera. ¿Estás seguro de que deseas activar este calendario?`,
          () => {
            this.confirmActivation(calendarioToUpdate);
          }
        );
      } else {
        this.confirmActivation(calendarioToUpdate);
      }
    } else {
      this.showToast('error', 'No se pudo encontrar el calendario a activar.');
    }
  }

  confirmActivation(calendarioToUpdate: Calendario) {
    if (this.hasActiveCalendario) {
      this.showConfirmDialog(
        'Confirmar activación de calendario',
        'Actualmente tienes un calendario activo. Si activas este nuevo calendario, el anterior se desactivará automáticamente y se moverá a la papelera. ¿Deseas continuar?',
        () => {
          // Desactivar el calendario activo actual
          const activeCalendario = this.calendarios.find((cal) => cal.activo);
          if (activeCalendario && activeCalendario.id !== undefined) {
            this.calendarioService
              .updateCalendarioStatus(activeCalendario.id, false)
              .subscribe({
                next: () => {
                  this.actualizarYActivarCalendario(calendarioToUpdate);
                },
                error: (error: any) => {
                  this.showToast(
                    'error',
                    'Error al desactivar el calendario anterior'
                  );
                },
              });
          }
        }
      );
    } else {
      this.actualizarYActivarCalendario(calendarioToUpdate);
    }
  }

  actualizarYActivarCalendario(calendarioToUpdate: Calendario) {
    calendarioToUpdate.activo = true;
    const formData: FormData = new FormData();
    formData.append('id', calendarioToUpdate.id!.toString());
    formData.append('titulo', calendarioToUpdate.titulo);
    formData.append('activo', 'true');

    this.calendarioService.updateCalendario(formData).subscribe({
      next: (response: any) => {
        this.showToast('success', 'Calendario activado correctamente');
        this.loadCalendarios();
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterCalendarios();
  }

  filterCalendarios() {
    this.hasActiveCalendario = this.calendarios.some((cal) => cal.activo);
    if (this.currentTab === 'active') {
      this.filteredCalendarios = this.calendarios.filter((cal) => cal.activo);
    } else {
      this.papeleraCalendarios = this.calendarios.filter((cal) => !cal.activo);
    }
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.currentTab === 'active') {
      this.filteredCalendarios = this.calendarios.filter(
        (calendario) =>
          calendario.activo &&
          (calendario.titulo.toLowerCase().includes(value) ||
            (calendario.fecha_creacion &&
              calendario.fecha_creacion.includes(value)))
      );
    } else {
      this.papeleraCalendarios = this.calendarios.filter(
        (calendario) =>
          !calendario.activo &&
          (calendario.titulo.toLowerCase().includes(value) ||
            (calendario.fecha_creacion &&
              calendario.fecha_creacion.includes(value)))
      );
    }
  }

  viewCalendario(calendario: Calendario) {
    this.selectedCalendario = calendario;
    this.isViewModalOpen = true;
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
      iconColor: '#008779',
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
      iconColor: '#FD9B63',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#E5E7EB',
      reverseButtons: true,
      focusCancel: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.style.color = 'white';
        }
        const cancelButton = Swal.getCancelButton();
        if (cancelButton) {
          cancelButton.style.color = 'black';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  updateTitulo() {
    const anio = this.calendarioForm.get('anio')?.value;
    if (anio) {
      this.calendarioForm.patchValue({ titulo: `Calendario Escolar ${anio}` });
    }
  }
}
