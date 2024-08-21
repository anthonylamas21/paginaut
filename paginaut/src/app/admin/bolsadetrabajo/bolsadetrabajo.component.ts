import {
  Component,
  HostListener,
  OnInit,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {
  BolsaDeTrabajoService,
  BolsaDeTrabajo,
  Requisito,
} from '../bolsa-de-trabajo.service';
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
  selector: 'app-agregar-bolsa-trabajo',
  templateUrl: 'bolsadetrabajo.component.html',
  styleUrls: ['bolsadetrabajo.component.css'],
})
export class AgregarBolsaTrabajoComponent implements OnInit {
  bolsaDeTrabajoForm: FormGroup;
  requisitosForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  isRequisitosModalOpen: boolean = false;
  bolsas: BolsaDeTrabajo[] = [];
  filteredBolsas: BolsaDeTrabajo[] = [];
  papeleraBolsas: BolsaDeTrabajo[] = [];
  currentBolsaDeTrabajoId?: number;
  id_bolsaTrabajo?: number;
  currentBolsa?: BolsaDeTrabajo;
  selectedBolsa?: BolsaDeTrabajo;
  currentTab: 'active' | 'inactive' = 'active';
  fileToUpload: File | null = null;
  baseImageUrl = 'http://localhost/paginaut/';
  isDetailsModalOpen = false;
  getrequisitos?: Array<{ requisito: string }>;
  IDMostrarRequisitos?: number;

  constructor(
    private fb: FormBuilder,
    private bolsaDeTrabajoService: BolsaDeTrabajoService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.bolsaDeTrabajoForm = this.fb.group({
      id: [''],
      nombre_empresa: [''],
      descripcion_trabajo: [''],
      puesto_trabajo: [''],
      direccion: [''],
      telefono: [''],
      correo: [''],
    });

    this.requisitosForm = this.fb.group({
      requisitos: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadBolsas();
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

  createRequisito(): FormGroup {
    return this.fb.group({
      requisito: [''],
    });
  }

  get requisitos(): FormArray {
    return this.requisitosForm.get('requisitos') as FormArray;
  }

  removeRequisito(index: number) {
    if (this.requisitos.length > 1) {
      this.requisitos.removeAt(index);
      this.cdr.detectChanges(); // Forzar la detección de cambios
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No puedes eliminar el último requisito',
        text: 'Debe haber al menos un requisito en el formulario.',
        showConfirmButton: false,
        timer: 3000,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  }

  addRequisito() {
    this.requisitos.push(this.createRequisito());
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  onSubmitBolsa() {
    const bolsaData = this.bolsaDeTrabajoForm.value;

    if (this.currentBolsaDeTrabajoId) {
      this.bolsaDeTrabajoService
        .updateBolsa(this.currentBolsaDeTrabajoId, bolsaData)
        .subscribe({
          next: (response: any) => {
            this.showToast(
              'success',
              'Bolsa de trabajo actualizada correctamente'
            );
            this.loadBolsas();
            this.closeModal();
            // No abrir el modal de requisitos de nuevo, mantén los requisitos actuales
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
    } else {
      this.bolsaDeTrabajoService.addBolsa(bolsaData).subscribe(
        (response) => {
          this.currentBolsaDeTrabajoId = response.id; // Guardar ID de la bolsa recién creada
          this.showToast('success', 'Bolsa de trabajo agregada correctamente');
          this.loadBolsas();
          this.closeModal();
          this.openRequisitosModal(); // Abrir modal de requisitos después de crear
        },
        (error) => {
          this.showToast('error', error.message);
        }
      );
    }
  }

  onSubmitRequisitos() {
    if (this.requisitosForm.valid && this.currentBolsaDeTrabajoId) {
      const requisitosData = this.requisitosForm.value.requisitos.map(
        (requisito: any) => ({
          ...requisito,
          id_bolsadetrabajo: this.currentBolsaDeTrabajoId,
        })
      );

      // Actualizar requisitos existentes y agregar nuevos
      this.bolsaDeTrabajoService.updateRequisitos(requisitosData).subscribe(
        (response) => {
          this.showToast('success', 'Requisitos actualizados correctamente');
          this.closeRequisitosModal(); // Cerrar el modal después de agregar
          this.loadBolsas();
        },
        (error) => {
          this.showToast('error', error.message);
        }
      );
    }
  }

  openModal(bolsa?: BolsaDeTrabajo) {
    if (bolsa) {
      this.currentBolsaDeTrabajoId = bolsa.id;
      this.bolsaDeTrabajoForm.patchValue(bolsa);
      if (bolsa.id !== undefined) {
        this.loadRequisitos(bolsa.id);
      }
    } else {
      this.bolsaDeTrabajoForm.reset();
      this.currentBolsaDeTrabajoId = undefined;
      this.requisitos.clear();
      this.addRequisito();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openRequisitosModal(bolsa?: BolsaDeTrabajo) {
    if (bolsa && bolsa.id !== undefined) {
      this.currentBolsaDeTrabajoId = bolsa.id;
      this.loadRequisitos(bolsa.id);
    } else {
      this.currentBolsaDeTrabajoId = undefined;
      this.requisitosForm.reset();
      this.requisitos.clear();
      this.addRequisito();
    }
    this.isRequisitosModalOpen = true;
  }

  closeRequisitosModal() {
    this.isRequisitosModalOpen = false;
  }

  loadBolsas() {
    this.bolsaDeTrabajoService.getBolsas().subscribe({
      next: (response: any) => {
        this.bolsas = response.records;
        this.filterBolsas();
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  deleteBolsa(id: number) {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres eliminar esta bolsa de trabajo? Esta acción no se puede deshacer.',
      () => {
        this.bolsaDeTrabajoService.deleteBolsa(id).subscribe({
          next: (response: any) => {
            this.showToast(
              'success',
              'Bolsa de trabajo eliminada correctamente'
            );
            this.loadBolsas();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  moveToTrash(id: number) {
    //console.log('id ', id);
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres mover esta bolsa de trabajo a la papelera?',
      () => {
        this.bolsaDeTrabajoService.updateBolsaStatus(id, false).subscribe(
          (response) => {
            this.showToast(
              'success',
              'Bolsa de trabajo movida a la papelera correctamente'
            );
            this.loadBolsas();
          },
          (error) => {
            this.showToast('error', error.message);
          }
        );
      }
    );
  }

  activateBolsa(id: number) {
    const bolsaToUpdate = this.bolsas.find((bolsa) => bolsa.id === id);
    if (bolsaToUpdate) {
      bolsaToUpdate.activo = true;
      const formData = { ...bolsaToUpdate, activo: true };
      this.bolsaDeTrabajoService
        .updateBolsa(bolsaToUpdate.id!, formData)
        .subscribe({
          next: (response: any) => {
            this.showToast(
              'success',
              'Bolsa de trabajo activada correctamente'
            );
            this.loadBolsas();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterBolsas();
  }

  filterBolsas() {
    if (this.currentTab === 'active') {
      this.filteredBolsas = this.bolsas.filter((bolsa) => bolsa.activo);
    } else {
      this.papeleraBolsas = this.bolsas.filter((bolsa) => !bolsa.activo);
    }
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.currentTab === 'active') {
      this.filteredBolsas = this.bolsas.filter(
        (bolsa) =>
          bolsa.activo &&
          (bolsa.nombre_empresa.toLowerCase().includes(value) ||
            (bolsa.fecha_creacion && bolsa.fecha_creacion.includes(value)))
      );
    } else {
      this.papeleraBolsas = this.bolsas.filter(
        (bolsa) =>
          !bolsa.activo &&
          (bolsa.nombre_empresa.toLowerCase().includes(value) ||
            (bolsa.fecha_creacion && bolsa.fecha_creacion.includes(value)))
      );
    }
  }

  openDetailsModal(bolsaTrabajo: BolsaDeTrabajo): void {
    this.selectedBolsa = bolsaTrabajo;
    console.log(this.selectedBolsa);
    this.isDetailsModalOpen = true;
  }

  loadRequisitosBolsa(bolsaTrabajo: BolsaDeTrabajo) {
    const id = bolsaTrabajo.id;
    if (id && typeof id === 'number') {
      this.bolsaDeTrabajoService.getRequisitos(id).subscribe(
        (response) => {
          this.getrequisitos = response.details;
          console.log('Requisitos recibidos:', this.getrequisitos);
        },
        (error) => {
          this.showToast('error', error.message);
        }
      );
    } else {
      console.error('ID no es un número:', id);
    }
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
  }

  mostrar(elemento: any): void {
    // Verifica si el elemento recibido es un botón
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
          // Ajustar la posición del tooltip
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

  private loadRequisitos(id_bolsaTrabajo: number) {
    this.bolsaDeTrabajoService.getRequisitos(id_bolsaTrabajo).subscribe(
      (response) => {
        this.requisitos.clear(); // Limpia los requisitos actuales en el formulario
        if (response.details && response.details.length > 0) {
          response.details.forEach((requisito: any) => {
            this.requisitos.push(
              this.fb.group({ requisito: requisito.requisito })
            );
          });
        } else {
          this.addRequisito(); // Añadir un requisito inicial si no hay requisitos
        }
      },
      (error) => {
        this.showToast('error', error.message);
      }
    );
  }
}
