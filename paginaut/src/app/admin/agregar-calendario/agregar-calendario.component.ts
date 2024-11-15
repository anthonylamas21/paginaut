import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CalendarioService, Calendario } from '../calendario.service';
import Swal from 'sweetalert2';
import { BASEIMAGEN } from '../../constans';

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

// Validador para el campo de año
function yearValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validYear = /^[0-9]{4}$/;
    return validYear.test(control.value) ? null : { invalidYear: true };
  };
}

// Validador para el rango de año
function yearRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const year = parseInt(control.value, 10);
    const currentYear = new Date().getFullYear();
    return isNaN(year) || year < 1900 || year > currentYear
      ? { outOfRange: true }
      : null;
  };
}

// Validador para impedir espacios en blanco en el título
function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

// Validador para prevenir inyección de scripts
function scriptInjectionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    return scriptPattern.test(control.value) ? { scriptInjection: true } : null;
  };
}

// Validador para evitar títulos duplicados
function duplicateTitleValidator(calendarios: Calendario[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const title = control.value || '';
    const duplicate = calendarios.some(
      (calendario) => calendario.titulo === title
    );
    return duplicate ? { duplicateTitle: true } : null;
  };
}

@Component({
  selector: 'app-agregar-calendario',
  templateUrl: './agregar-calendario.component.html',
  styleUrls: ['./agregar-calendario.component.css'],
})
export class AgregarCalendarioComponent implements OnInit {
  @ViewChild('archivoInput') archivoInput!: ElementRef;
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
  baseImageUrl = BASEIMAGEN+'/';

  constructor(
    private fb: FormBuilder,
    private calendarioService: CalendarioService,
    public sanitizer: DomSanitizer
  ) {
    this.calendarioForm = this.fb.group({
      anio: [
        '',
        [
          Validators.required,
          Validators.maxLength(4),
          yearValidator(),
          yearRangeValidator(),
        ],
      ],
      titulo: [
        { value: '', disabled: true },
        [
          noWhitespaceValidator(),
          scriptInjectionValidator(),
          duplicateTitleValidator(this.calendarios),
        ],
      ],
      archivo: [''],
    });
  }

  ngOnInit() {
    this.loadCalendarios();
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
      nabvar.classList.add('bg-primary-color');
    }
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
          next: () => {
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
          next: () => {
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
      this.calendarioForm.get('archivo')?.setValue(file.name); // Asigna valor al control
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

  onPaste(event: ClipboardEvent) {
    const clipboardData =
      event.clipboardData || (window as any)['clipboardData'];
    const pastedText = clipboardData.getData('text');
    const allowedPattern = /^[0-9]{0,4}$/;

    if (!allowedPattern.test(pastedText)) {
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

    // Resetear el input de archivo manualmente
    if (this.archivoInput) {
      this.archivoInput.nativeElement.value = '';
    }
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
          next: () => {
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
          next: () => {
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
      if (this.hasActiveCalendario && this.papeleraCalendarios.length >= 1) {
        this.showConfirmDialog(
          'Confirmar activación de calendario',
          'Actualmente tienes un calendario activo. Si activas este nuevo calendario, el anterior se desactivará automáticamente y se moverá a la papelera. ¿Deseas continuar?',
          () => {
            this.desactivarYActivar(calendarioToUpdate);
          }
        );
      } else if (
        !this.hasActiveCalendario &&
        this.papeleraCalendarios.length === 1
      ) {
        this.showConfirmDialog(
          'Reactivar Calendario',
          '¿Quieres reactivar esta Calendario?',
          () => {
            this.actualizarYActivarCalendario(calendarioToUpdate);
          }
        );
      } else if (
        !this.hasActiveCalendario &&
        this.papeleraCalendarios.length >= 2
      ) {
        this.showConfirmDialog(
          'Confirmar activación de calendario',
          'Tienes más de un calendario en la papelera. ¿Estás seguro de que deseas activar este calendario?',
          () => {
            this.actualizarYActivarCalendario(calendarioToUpdate);
          }
        );
      } else {
        this.actualizarYActivarCalendario(calendarioToUpdate);
      }
    } else {
      this.showToast('error', 'No se pudo encontrar el calendario a activar.');
    }
  }

  desactivarYActivar(calendarioToUpdate: Calendario) {
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
      next: () => {
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

  // Validación de duplicados
  validateDuplicate(calendarioForm: FormGroup): void {
    const anio = calendarioForm.get('anio')?.value;
    const titulo = `Calendario Escolar ${anio}`;

    if (this.calendarios.some((cal) => cal.titulo === titulo)) {
      calendarioForm.setErrors({ duplicate: true });
    }
  }
}
