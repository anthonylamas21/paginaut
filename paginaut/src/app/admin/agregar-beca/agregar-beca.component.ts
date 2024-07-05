import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BecaService, Beca } from '../beca.service';
import Swal from 'sweetalert2';

class TooltipManager {
  static adjustTooltipPosition(
    button: HTMLElement,
    tooltip: HTMLElement
  ): void {
    // Obtener dimensiones del botón y del tooltip
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Obtener dimensiones de la ventana
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calcular la posición preferida del tooltip
    const preferredLeft =
      buttonRect.left - tooltipRect.width / 2 + buttonRect.width / 2;
    const preferredTop = buttonRect.top - tooltipRect.height - 10; // Espacio entre el botón y el tooltip

    // Ajustar la posición si se sale de la pantalla hacia la izquierda
    let left = Math.max(preferredLeft, 0);

    // Ajustar la posición si se sale de la pantalla hacia arriba
    let top = Math.max(preferredTop, 0);

    // Ajustar la posición si el tooltip se sale de la pantalla hacia la derecha
    if (left + tooltipRect.width > windowWidth) {
      left = windowWidth - tooltipRect.width;
    }

    // Ajustar la posición si el tooltip se sale de la pantalla hacia abajo
    if (top + tooltipRect.height > windowHeight) {
      top = windowHeight - tooltipRect.height;
    }

    // Aplicar posición al tooltip
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }
}

@Component({
  selector: 'app-agregar-beca',
  templateUrl: './agregar-beca.component.html',
  styleUrls: ['./agregar-beca.component.css'],
})
export class AgregarBecaComponent implements OnInit {
  becaForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  becas: Beca[] = [];
  filteredBecas: Beca[] = [];
  papeleraBecas: Beca[] = [];
  currentBecaId?: number;
  currentBeca?: Beca;
  currentTab: 'active' | 'inactive' = 'active';
  fileToUpload: File | null = null;
  currentFileName: string = '';

  constructor(private fb: FormBuilder, private becaService: BecaService) {
    this.becaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      archivo: [''],
    });
  }

  ngOnInit() {
    this.loadBecas();
  }

  onSubmit() {
    if (this.becaForm.valid) {
      const formData: FormData = new FormData();
      formData.append('nombre', this.becaForm.get('nombre')?.value);
      formData.append('descripcion', this.becaForm.get('descripcion')?.value);
      if (this.fileToUpload) {
        formData.append('archivo', this.fileToUpload, this.fileToUpload.name);
      } else {
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
    if (file) {
      this.fileToUpload = file;
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
  }

  openModal(beca?: Beca) {
    if (beca) {
      this.currentBecaId = beca.id;
      this.currentBeca = beca;
      this.currentFileName = beca.archivo;
      this.becaForm.patchValue({
        nombre: beca.nombre,
        descripcion: beca.descripcion,
      });
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
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

  moveToTrash(id: number) {
    const becaToUpdate = this.becas.find((beca) => beca.id === id);
    if (becaToUpdate) {
      becaToUpdate.activo = false;
      this.becaService.updateBecaStatus(becaToUpdate.id!, false).subscribe({
        next: (response: any) => {
          this.showToast('success', 'Beca movida a la papelera correctamente');
          this.loadBecas();
        },
        error: (error: any) => {
          this.showToast('error', error.message);
        },
      });
    }
  }

  activateBeca(id: number) {
    const becaToUpdate = this.becas.find((beca) => beca.id === id);
    if (becaToUpdate) {
      becaToUpdate.activo = true;
      const formData: FormData = new FormData();
      formData.append('id', becaToUpdate.id!.toString());
      formData.append('nombre', becaToUpdate.nombre);
      formData.append('descripcion', becaToUpdate.descripcion);
      formData.append('activo', 'true');
      this.becaService.updateBeca(formData).subscribe({
        next: (response: any) => {
          this.showToast('success', 'Beca activada correctamente');
          this.loadBecas();
        },
        error: (error: any) => {
          this.showToast('error', error.message);
        },
      });
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

  deleteBeca(id: number) {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres eliminar esta beca? Esta acción no se puede deshacer.',
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

  private showToast(
    icon: 'success' | 'warning' | 'error' | 'info' | 'question',
    title: string
  ): void {
    const iconColors = {
      success: '#008779',
      warning: '#FD9B63',
      error: '#EF4444',
      info: '#3ABEF9',
      question: '#5A72A0',
    };

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      iconColor: iconColors[icon],
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
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
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
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
}
