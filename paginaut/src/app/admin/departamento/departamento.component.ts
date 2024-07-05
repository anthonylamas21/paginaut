import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService, Departamento } from '../../departamenoService/departamento.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css'],
})
export class DepartamentoComponent implements OnInit {
  departamentoForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  departamentos: Departamento[] = [];
  filteredDepartamentos: Departamento[] = [];
  papeleraDepartamentos: Departamento[] = [];
  currentDepartamentoId?: number;
  currentTab: 'active' | 'inactive' = 'active';

  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService
  ) {
    this.departamentoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
    this.loadDepartamentos();
  }

  onSubmit() {
    if (this.departamentoForm.valid) {
      const departamentoData: Departamento = this.departamentoForm.value;
      departamentoData.activo = true;
      if (this.currentDepartamentoId) {
        departamentoData.id = this.currentDepartamentoId;
        this.departamentoService.actualizarDepartamento(departamentoData).subscribe({
          next: (response) => {
            console.log('Departamento actualizado con éxito', response);
            this.successMessage = 'Departamento actualizado correctamente';
            this.loadDepartamentos();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al actualizar el departamento', error);
            this.errorMessage = error.message;
          },
        });
      } else {
        departamentoData.activo = true; // Set activo to true by default for new departments
        this.departamentoService.agregarDepartamento(departamentoData).subscribe({
          next: (response) => {
            console.log('Departamento agregado con éxito', response);
            this.successMessage = 'Departamento agregado correctamente';
            this.loadDepartamentos();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al agregar el departamento', error);
            this.errorMessage = error.message;
          },
        });
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }

  resetForm() {
    this.departamentoForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentDepartamentoId = undefined;
  }

  openModal(departamento?: Departamento) {
    if (departamento) {
      this.currentDepartamentoId = departamento.id;
      this.departamentoForm.patchValue(departamento);
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadDepartamentos() {
    this.departamentoService.obtenerDepartamentos().subscribe({
      next: (response: any) => {
        this.departamentos = response.records;
        this.filterDepartamentos();
      },
      error: (error) => {
        console.error('Error al cargar los departamentos', error);
        this.errorMessage = error.message;
      },
    });
  }

  confirmDeleteDepartamento(id: number | undefined) {
    if (id !== undefined) {
      this.changeDepartamentoStatus(id, false);
    }
  }

  changeDepartamentoStatus(id: number, status: boolean) {
    const departamentoToUpdate = this.departamentos.find((d) => d.id === id);
    if (departamentoToUpdate) {
      departamentoToUpdate.activo = status;
      this.departamentoService.actualizarDepartamento(departamentoToUpdate).subscribe({
        next: (response) => {
          console.log('Departamento actualizado con éxito', response);
          this.successMessage = status
            ? 'Departamento activado correctamente'
            : 'Departamento enviado a la papelera correctamente';
          this.loadDepartamentos();
        },
        error: (error) => {
          console.error('Error al actualizar el departamento', error);
          this.errorMessage = error.message;
        },
      });
    }
  }

  deleteDepartamento(id: number) {
    this.departamentoService.eliminarDepartamento(id).subscribe({
      next: (response) => {
        console.log('Departamento eliminado con éxito', response);
        this.successMessage = 'Departamento eliminado correctamente';
        this.loadDepartamentos(); // Vuelve a cargar los departamentos después de eliminar
      },
      error: (error) => {
        console.error('Error al eliminar el departamento', error);
        this.errorMessage = error.message;
      },
    });
  }

  activateDepartamento(id: number) {
    this.changeDepartamentoStatus(id, true);
  }

  filterDepartamentos() {
    this.filteredDepartamentos = this.departamentos.filter(
      (departamento) => departamento.activo
    );
    this.papeleraDepartamentos = this.departamentos.filter(
      (departamento) => !departamento.activo
    );
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.currentTab === 'active') {
      this.filteredDepartamentos = this.departamentos.filter(
        (departamento) =>
          departamento.activo &&
          (departamento.nombre.toLowerCase().includes(value) ||
            (departamento.fecha_creacion &&
              departamento.fecha_creacion.includes(value)))
      );
    } else {
      this.papeleraDepartamentos = this.departamentos.filter(
        (departamento) =>
          !departamento.activo &&
          (departamento.nombre.toLowerCase().includes(value) ||
            (departamento.fecha_creacion &&
              departamento.fecha_creacion.includes(value)))
      );
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterDepartamentos();
  }
}
