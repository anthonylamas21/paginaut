import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DireccionService, Direccion } from '../direccion.service';

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
  direcciones: Direccion[] = [];
  filteredDirecciones: Direccion[] = [];
  papeleraDirecciones: Direccion[] = [];
  currentDireccionId?: number;
  currentTab: 'active' | 'inactive' = 'active';

  constructor(
    private fb: FormBuilder,
    private direccionService: DireccionService
  ) {
    this.direccionForm = this.fb.group({
      abreviatura: ['', [Validators.required, Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
    this.loadDirecciones();
  }

  onSubmit() {
    if (this.direccionForm.valid) {
      const direccionData: Direccion = this.direccionForm.value;
      if (this.currentDireccionId) {
        direccionData.id = this.currentDireccionId;
        this.direccionService.actualizarDireccion(direccionData).subscribe({
          next: (response) => {
            console.log('Dirección actualizada con éxito', response);
            this.successMessage = 'Dirección actualizada correctamente';
            this.loadDirecciones();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al actualizar la dirección', error);
            this.errorMessage = error.message;
          },
        });
      } else {
        direccionData.activo = true; // Set activo to true by default for new addresses
        this.direccionService.agregarDireccion(direccionData).subscribe({
          next: (response) => {
            console.log('Dirección agregada con éxito', response);
            this.successMessage = 'Dirección agregada correctamente';
            this.loadDirecciones();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al agregar la dirección', error);
            this.errorMessage = error.message;
          },
        });
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }

  resetForm() {
    this.direccionForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentDireccionId = undefined;
  }

  openModal(direccion?: Direccion) {
    if (direccion) {
      this.currentDireccionId = direccion.id;
      this.direccionForm.patchValue(direccion);
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadDirecciones() {
    this.direccionService.obtenerDirecciones().subscribe({
      next: (response: any) => {
        this.direcciones = response.records;
        this.filterDirecciones();
      },
      error: (error) => {
        console.error('Error al cargar las direcciones', error);
      },
    });
  }

  confirmDeleteDireccion(id: number | undefined) {
    if (id !== undefined) {
      this.changeDireccionStatus(id, false);
    }
  }

  changeDireccionStatus(id: number, status: boolean) {
    const direccionToUpdate = this.direcciones.find((d) => d.id === id);
    if (direccionToUpdate) {
      direccionToUpdate.activo = status;
      this.direccionService.actualizarDireccion(direccionToUpdate).subscribe({
        next: (response) => {
          console.log('Dirección actualizada con éxito', response);
          this.successMessage = status
            ? 'Dirección activada correctamente'
            : 'Dirección enviada a la papelera correctamente';
          this.loadDirecciones();
        },
        error: (error) => {
          console.error('Error al actualizar la dirección', error);
          this.errorMessage = error.message;
        },
      });
    }
  }

  deleteDireccion(id: number) {
    this.direccionService.eliminarDireccion(id).subscribe({
      next: (response) => {
        console.log('Dirección eliminada con éxito', response);
        this.successMessage = 'Dirección eliminada correctamente';
        this.loadDirecciones();
      },
      error: (error) => {
        console.error('Error al eliminar la dirección', error);
        this.errorMessage = error.message;
      },
    });
  }

  activateDireccion(id: number) {
    this.changeDireccionStatus(id, true);
  }

  filterDirecciones() {
    this.filteredDirecciones = this.direcciones.filter(
      (direccion) => direccion.activo
    );
    this.papeleraDirecciones = this.direcciones.filter(
      (direccion) => !direccion.activo
    );
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

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterDirecciones();
  }
}
