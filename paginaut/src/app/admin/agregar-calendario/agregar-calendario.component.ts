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
  currentCalendario?: Calendario;
  currentTab: 'active' | 'inactive' = 'active';
  fileToUpload: File | null = null;
  currentFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private calendarioService: CalendarioService
  ) {
    this.calendarioForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
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
            console.log('Calendario actualizado con éxito', response);
            this.successMessage = 'Calendario actualizado correctamente';
            this.loadCalendarios();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            console.error('Error al actualizar el calendario', error);
            this.errorMessage = error.message;
          },
        });
      } else {
        this.calendarioService.addCalendario(formData).subscribe({
          next: (response: any) => {
            console.log('Calendario agregado con éxito', response);
            this.successMessage = 'Calendario agregado correctamente';
            this.loadCalendarios();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            console.error('Error al agregar el calendario', error);
            this.errorMessage = error.message;
          },
        });
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
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
        titulo: calendario.titulo,
      });
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadCalendarios() {
    this.calendarioService.getCalendarios().subscribe({
      next: (response: any) => {
        this.calendarios = response.records;
        this.filterCalendarios();
      },
      error: (error: any) => {
        console.error('Error al cargar los calendarios', error);
        this.errorMessage = error.message;
      },
    });
  }

  deleteCalendario(id: number) {
    this.calendarioService.deleteCalendario(id).subscribe({
      next: (response: any) => {
        console.log('Calendario eliminado con éxito', response);
        this.successMessage = 'Calendario eliminado correctamente';
        this.loadCalendarios(); // Vuelve a cargar los calendarios después de eliminar
      },
      error: (error: any) => {
        console.error('Error al eliminar el calendario', error);
        this.errorMessage = error.message;
      },
    });
  }

  activateCalendario(id: number) {
    const calendarioToUpdate = this.calendarios.find((cal) => cal.id === id);
    if (calendarioToUpdate) {
      calendarioToUpdate.activo = true;
      const formData: FormData = new FormData();
      formData.append('id', calendarioToUpdate.id!.toString());
      formData.append('titulo', calendarioToUpdate.titulo);
      formData.append('activo', 'true');
      this.calendarioService.updateCalendario(formData).subscribe({
        next: (response: any) => {
          console.log('Calendario activado con éxito', response);
          this.successMessage = 'Calendario activado correctamente';
          this.loadCalendarios();
        },
        error: (error: any) => {
          console.error('Error al activar el calendario', error);
          this.errorMessage = error.message;
        },
      });
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterCalendarios();
  }

  filterCalendarios() {
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
}
