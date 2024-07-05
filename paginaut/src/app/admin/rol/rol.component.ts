import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolService, Rol } from '../../rolService/rol.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css'],
})

export class RolComponent implements OnInit {
  rolForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  roles: Rol[] = [];
  filteredRoles: Rol[] = [];
  papeleraRoles: Rol[] = [];
  currentRolId?: number;
  currentTab: 'active' | 'inactive' = 'active';

  constructor(
    private fb: FormBuilder,
    private rolService: RolService
  ) {
    this.rolForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
    this.loadRoles();
  }

  onSubmit() {
    if (this.rolForm.valid) {
      const rolData: Rol = this.rolForm.value;
      rolData.activo = true;
      if (this.currentRolId) {
        rolData.id = this.currentRolId;
        this.rolService.actualizarRol(rolData).subscribe({
          next: (response) => {
            console.log('Rol actualizado con éxito', response);
            this.successMessage = 'Rol actualizado correctamente';
            this.loadRoles();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al actualizar el rol', error);
            this.errorMessage = error.message;
          },
        });
      } else {
        rolData.activo = true; // Set activo to true by default for new roles
        this.rolService.agregarRol(rolData).subscribe({
          next: (response) => {
            console.log('Rol agregado con éxito', response);
            this.successMessage = 'Rol agregado correctamente';
            this.loadRoles();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al agregar el rol', error);
            this.errorMessage = error.message;
          },
        });
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }

  resetForm() {
    this.rolForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentRolId = undefined;
  }

  openModal(rol?: Rol) {
    if (rol) {
      this.currentRolId = rol.id;
      this.rolForm.patchValue(rol);
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadRoles() {
    this.rolService.obtenerRoles().subscribe({
      next: (response: any) => {
        this.roles = response.records;
        this.filterRoles();
      },
      error: (error) => {
        console.error('Error al cargar los roles', error);
        this.errorMessage = error.message;
      },
    });
  }

  confirmDeleteRol(id: number | undefined) {
    if (id !== undefined) {
      this.changeRolStatus(id, false);
    }
  }

  changeRolStatus(id: number, status: boolean) {
    const rolToUpdate = this.roles.find((r) => r.id === id);
    if (rolToUpdate) {
      status = status;
      rolToUpdate.activo = status;
      this.rolService.actualizarRol(rolToUpdate).subscribe({
        next: (response) => {
          console.log('Rol actualizado con éxito', response);
          this.successMessage = status
            ? 'Rol activado correctamente'
            : 'Rol enviado a la papelera correctamente';
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error al actualizar el rol', error);
          this.errorMessage = error.message;
        },
      });
    }
  }

  deleteRol(id: number) {
    this.rolService.eliminarRol(id).subscribe({
      next: (response) => {
        console.log('Rol eliminado con éxito', response);
        this.successMessage = 'Rol eliminado correctamente';
        this.loadRoles(); // Vuelve a cargar los roles después de eliminar
      },
      error: (error) => {
        console.error('Error al eliminar el rol', error);
        this.errorMessage = error.message;
      },
    });
  }

  activateRol(id: number) {
    this.changeRolStatus(id, true);
  }

  filterRoles() {
    this.filteredRoles = this.roles.filter(
      (rol) => rol.activo
    );
    this.papeleraRoles = this.roles.filter(
      (rol) => !rol.activo
    );
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.currentTab === 'active') {
      this.filteredRoles = this.roles.filter(
        (rol) =>
          rol.activo &&
          (rol.nombre.toLowerCase().includes(value) ||
            (rol.fecha_creacion &&
              rol.fecha_creacion.includes(value)))
      );
    } else {
      this.papeleraRoles = this.roles.filter(
        (rol) =>
          !rol.activo &&
          (rol.nombre.toLowerCase().includes(value) ||
            (rol.fecha_creacion &&
              rol.fecha_creacion.includes(value)))
      );
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterRoles();
  }
}
