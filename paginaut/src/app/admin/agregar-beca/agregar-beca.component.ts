import {
  Component,
  HostListener,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BecaService, Beca } from '../beca.service';
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

// Validador personalizado para impedir espacios en blanco
function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

// Validador personalizado para impedir comas dobles
function noDoubleCommasValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasDoubleCommas = (control.value || '').includes(',,');
    return hasDoubleCommas ? { doubleCommas: true } : null;
  };
}

// Validador personalizado para impedir puntos dobles
function noDoubleDotsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasDoubleDots = (control.value || '').includes('..');
    return hasDoubleDots ? { doubleDots: true } : null;
  };
}

// Validador personalizado para evitar múltiples espacios consecutivos
function noMultipleSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasMultipleSpaces = (control.value || '').includes('  ');
    return hasMultipleSpaces ? { multipleSpaces: true } : null;
  };
}

// Validador personalizado para evitar caracteres no permitidos o erratas
function noTypoOrErrataValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbiddenPattern = /[\~\^\´\`\¨<>{}]/; // Añadir más caracteres según sea necesario
    const hasForbiddenChars = forbiddenPattern.test(control.value || '');
    return hasForbiddenChars ? { forbiddenChars: true } : null;
  };
}

// Validador para prevenir inyecciones SQL
function noSQLInjectionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const sqlPattern = /(select|insert|update|delete|drop|;|'|"|--)/i;
    const hasSQLInjection = sqlPattern.test(control.value || '');
    return hasSQLInjection ? { sqlInjection: true } : null;
  };
}

// Validador para prevenir inyecciones JavaScript
function noJavaScriptInjectionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const jsPattern = /(<script>|<\/script>|javascript:)/i;
    const hasJSInjection = jsPattern.test(control.value || '');
    return hasJSInjection ? { jsInjection: true } : null;
  };
}

// Validador para detectar errores ortográficos comunes
function noCommonTyposValidator(): ValidatorFn {
  const commonTypos: { [key: string]: string } = {
    becá: 'beca',
    descripccion: 'descripción',
    univercidad: 'universidad',
    'universidad tecnológica': 'Universidad Tecnológica de La Costa',
    tituló: 'título',
    alumnós: 'alumnos',
    'beca exelencia': 'beca de excelencia',
    // Agrega más erratas comunes aquí
  };

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase() || '';
    const typo = Object.keys(commonTypos).find((typo) => value.includes(typo));
    return typo
      ? {
          typo: `Error ortográfico detectado: "${typo}" debería ser "${commonTypos[typo]}"`,
        }
      : null;
  };
}

@Component({
  selector: 'app-agregar-beca',
  templateUrl: './agregar-beca.component.html',
  styleUrls: ['./agregar-beca.component.css'],
})
export class AgregarBecaComponent implements OnInit {
  @ViewChild('archivoInput') archivoInput!: ElementRef;
  becaForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  isViewModalOpen: boolean = false;
  becas: Beca[] = [];
  filteredBecas: Beca[] = [];
  papeleraBecas: Beca[] = [];
  currentBecaId?: number;
  currentBeca?: Beca;
  selectedBeca?: Beca;
  currentTab: 'active' | 'inactive' = 'active';
  fileToUpload: File | null = null;
  currentFileName: string = '';
  baseImageUrl = BASEIMAGEN+'/';

  constructor(
    private fb: FormBuilder,
    private becaService: BecaService,
    public sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
    this.becaForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(150), // Se ha actualizado a 150 caracteres
          Validators.pattern(/^[a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚ(),.*\-_*]+$/), // Permite acentos, paréntesis, guion medio, guion bajo, asterisco, comas y puntos
          noWhitespaceValidator(),
          noDoubleCommasValidator(),
          noDoubleDotsValidator(),
          noMultipleSpacesValidator(),
          noTypoOrErrataValidator(),
          noSQLInjectionValidator(),
          noJavaScriptInjectionValidator(),
          noCommonTyposValidator(),
        ],
      ],
      descripcion: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚ(),.*\-_*]+$/), // Permite acentos, paréntesis, guion medio, guion bajo, asterisco, comas y puntos
          noWhitespaceValidator(),
          noDoubleCommasValidator(),
          noDoubleDotsValidator(),
          noMultipleSpacesValidator(),
          noTypoOrErrataValidator(),
          noSQLInjectionValidator(),
          noJavaScriptInjectionValidator(),
          noCommonTyposValidator(),
        ],
      ],
      tipo: ['', Validators.required],
      archivo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBecas();
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
    if (this.becaForm.valid && (this.fileToUpload || this.currentFileName)) {
      const formData: FormData = new FormData();
      formData.append('nombre', this.becaForm.get('nombre')?.value);
      formData.append('descripcion', this.becaForm.get('descripcion')?.value);
      formData.append('tipo', this.becaForm.get('tipo')?.value);

      if (this.fileToUpload) {
        formData.append('archivo', this.fileToUpload, this.fileToUpload.name);
      } else if (this.currentFileName) {
        formData.append('archivo', this.currentFileName);
      }

      if (this.currentBecaId) {
        formData.append('id', this.currentBecaId.toString());
        this.becaService.updateBeca(formData).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Beca actualizada correctamente');
            this.loadBecas();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      } else {
        this.becaService.addBeca(formData).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Beca agregada correctamente');
            this.loadBecas();
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
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file && file.type === 'application/pdf') {
      if (file.size <= maxSize) {
        this.fileToUpload = file;
        this.becaForm.get('archivo')?.setValue(file.name);
      } else {
        this.becaForm.get('archivo')?.setErrors({ fileSizeExceeded: true });
        this.showToast(
          'error',
          'El archivo es demasiado grande. Máximo permitido: 2MB.'
        );
        this.fileToUpload = null;
      }
    } else {
      this.becaForm.get('archivo')?.setErrors({ invalidFileType: true });
      this.showToast('error', 'Solo se permiten archivos en formato PDF.');
      this.fileToUpload = null;
    }
  }

  @HostListener('paste', ['$event'])
  handlePaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('text') || '';
    const allowedPattern = /^[a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚ(),.*]*$/; // Permitir letras, números, espacios, puntos y comas
    if (!allowedPattern.test(pastedData)) {
      event.preventDefault();
    }
  }

  resetForm() {
    this.becaForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentBecaId = undefined;
    this.currentBeca = undefined;
    this.currentFileName = '';
    this.fileToUpload = null;

    // Resetear el input de archivo manualmente
    if (this.archivoInput) {
      this.archivoInput.nativeElement.value = '';
    }
  }

  openModal(beca?: Beca) {
    if (beca) {
      this.currentBecaId = beca.id;
      this.currentBeca = beca;
      this.currentFileName = beca.archivo;
      this.becaForm.patchValue({
        nombre: beca.nombre,
        descripcion: beca.descripcion,
        tipo: beca.tipo,
        archivo: beca.archivo, // Mantener el archivo actual
      });
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openViewModal(beca: Beca) {
    this.selectedBeca = beca;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
  }

  loadBecas() {
    this.becaService.getBecas().subscribe({
      next: (response: any) => {
        this.becas = response.records;
        this.filterBecas();
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  deleteBeca(id: number) {
    this.showConfirmDialog(
      'Eliminar beca',
      'Esta acción eliminará permanentemente la beca seleccionada. No podrás recuperarla. ¿Estás seguro de que deseas continuar?',
      () => {
        this.becaService.deleteBeca(id).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Beca eliminada correctamente');
            this.loadBecas();
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
      'Esta beca será movida a la papelera. Podrás restaurarla más tarde si lo deseas. ¿Quieres mover esta beca a la papelera?',
      () => {
        this.becaService.updateBecaStatus(id, false).subscribe({
          next: (response: any) => {
            this.showToast(
              'success',
              'Beca movida a la papelera correctamente'
            );
            this.loadBecas();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  activateBeca(id: number) {
    const becaToUpdate = this.becas.find((beca) => beca.id === id);
    if (becaToUpdate) {
      this.showConfirmDialog(
        'Reactivar beca',
        '¿Quieres reactivar esta beca?',
        () => {
          becaToUpdate.activo = true;
          const formData: FormData = new FormData();
          formData.append('id', becaToUpdate.id!.toString());
          formData.append('nombre', becaToUpdate.nombre);
          formData.append('descripcion', becaToUpdate.descripcion);
          formData.append('tipo', becaToUpdate.tipo);
          formData.append('activo', 'true');
          this.becaService.updateBeca(formData).subscribe({
            next: (response: any) => {
              this.showToast('success', 'Beca reactivada correctamente');
              this.loadBecas();
            },
            error: (error: any) => {
              this.showToast('error', error.message);
            },
          });
        }
      );
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterBecas();
  }

  filterBecas() {
    if (this.currentTab === 'active') {
      this.filteredBecas = this.becas.filter((beca) => beca.activo);
    } else {
      this.papeleraBecas = this.becas.filter((beca) => !beca.activo);
    }
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.currentTab === 'active') {
      this.filteredBecas = this.becas.filter(
        (beca) =>
          beca.activo &&
          (beca.nombre.toLowerCase().includes(value) ||
            (beca.fecha_creacion && beca.fecha_creacion.includes(value)))
      );
    } else {
      this.papeleraBecas = this.becas.filter(
        (beca) =>
          !beca.activo &&
          (beca.nombre.toLowerCase().includes(value) ||
            (beca.fecha_creacion && beca.fecha_creacion.includes(value)))
      );
    }
  }

  viewBeca(beca: Beca) {
    this.selectedBeca = beca;
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
}
