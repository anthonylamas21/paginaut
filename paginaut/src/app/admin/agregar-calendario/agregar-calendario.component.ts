import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarioService, Calendario } from '../calendario.service';

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
  calendarios: Calendario[] = [];
  filteredCalendarios: Calendario[] = [];
  papeleraCalendarios: Calendario[] = [];
  currentCalendarioId?: number;
  archivo?: File;
  currentTab: 'active' | 'inactive' = 'active';

  constructor(
    private fb: FormBuilder,
    private calendarioService: CalendarioService
  ) {
    this.calendarioForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      archivo: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadCalendarios();
  }

  onSubmit() {
    if (this.calendarioForm.valid) {
      const calendarioData: Calendario = this.calendarioForm.value;
      const formData = new FormData();
      formData.append('titulo', calendarioData.titulo);

      if (this.archivo) {
        formData.append('archivo', this.archivo);
      }

      if (this.currentCalendarioId) {
        formData.append('id', this.currentCalendarioId.toString());
        this.calendarioService.actualizarCalendario(formData).subscribe({
          next: (response) => {
            console.log('Calendario actualizado con éxito', response);
            this.successMessage = 'Calendario actualizado correctamente';
            this.loadCalendarios();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al actualizar el calendario', error);
            this.errorMessage = error.message;
          },
        });
      } else {
        this.calendarioService.agregarCalendario(formData).subscribe({
          next: (response) => {
            console.log('Calendario agregado con éxito', response);
            this.successMessage = 'Calendario agregado correctamente';
            this.loadCalendarios();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al agregar el calendario', error);
            this.errorMessage = error.message;
          },
        });
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }

  resetForm() {
    this.calendarioForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentCalendarioId = undefined;
    this.archivo = undefined;
  }

  openModal(calendario?: Calendario) {
    if (calendario) {
      this.currentCalendarioId = calendario.id;
      this.calendarioForm.patchValue(calendario);
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadCalendarios() {
    this.calendarioService.obtenerCalendarios().subscribe({
      next: (response: any) => {
        this.calendarios = response.records;
        this.filterCalendarios();
      },
      error: (error) => {
        console.error('Error al cargar los calendarios', error);
      },
    });
  }

  confirmDeleteCalendario(id: number | undefined) {
    if (id !== undefined) {
      this.changeCalendarioStatus(id, false);
    }
  }

  changeCalendarioStatus(id: number, status: boolean) {
    const calendarioToUpdate = this.calendarios.find((c) => c.id === id);
    if (calendarioToUpdate) {
      const formData = new FormData();
      formData.append('id', calendarioToUpdate.id?.toString() ?? '');
      formData.append('titulo', calendarioToUpdate.titulo ?? '');
      if (calendarioToUpdate.archivo) {
        formData.append('archivo', calendarioToUpdate.archivo);
      }
      formData.append('activo', status.toString());

      this.calendarioService.actualizarCalendario(formData).subscribe({
        next: (response) => {
          console.log('Calendario actualizado con éxito', response);
          this.successMessage = status
            ? 'Calendario activado correctamente'
            : 'Calendario enviado a la papelera correctamente';
          this.loadCalendarios();
        },
        error: (error) => {
          console.error('Error al actualizar el calendario', error);
          this.errorMessage = error.message;
        },
      });
    }
  }

  deleteCalendario(id: number) {
    this.calendarioService.eliminarCalendario(id).subscribe({
      next: (response) => {
        console.log('Calendario eliminado con éxito', response);
        this.successMessage = 'Calendario eliminado correctamente';
        this.loadCalendarios();
      },
      error: (error) => {
        console.error('Error al eliminar el calendario', error);
        this.errorMessage = error.message;
      },
    });
  }

  activateCalendario(id: number) {
    this.changeCalendarioStatus(id, true);
  }

  filterCalendarios() {
    this.filteredCalendarios = this.calendarios.filter(
      (calendario) => calendario.activo
    );
    this.papeleraCalendarios = this.calendarios.filter(
      (calendario) => !calendario.activo
    );
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

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterCalendarios();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivo = input.files[0];
    }
  }
}