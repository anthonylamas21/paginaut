import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BecaService, Beca } from '../beca.service';

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
            console.log('Beca actualizada con éxito', response);
            this.successMessage = 'Beca actualizada correctamente';
            this.loadBecas();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            console.error('Error al actualizar la beca', error);
            this.errorMessage = error.message;
          },
        });
      } else {
        this.becaService.addBeca(formData).subscribe({
          next: (response: any) => {
            console.log('Beca agregada con éxito', response);
            this.successMessage = 'Beca agregada correctamente';
            this.loadBecas();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            console.error('Error al agregar la beca', error);
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
        console.error('Error al cargar las becas', error);
        this.errorMessage = error.message;
      },
    });
  }

  moveToTrash(id: number) {
    const becaToUpdate = this.becas.find((beca) => beca.id === id);
    if (becaToUpdate) {
      becaToUpdate.activo = false;
      this.becaService.updateBecaStatus(becaToUpdate.id!, false).subscribe({
        next: (response: any) => {
          console.log('Beca movida a la papelera con éxito', response);
          this.successMessage = 'Beca movida a la papelera correctamente';
          this.loadBecas();
        },
        error: (error: any) => {
          console.error('Error al mover la beca a la papelera', error);
          this.errorMessage = error.message;
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
          console.log('Beca activada con éxito', response);
          this.successMessage = 'Beca activada correctamente';
          this.loadBecas();
        },
        error: (error: any) => {
          console.error('Error al activar la beca', error);
          this.errorMessage = error.message;
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
    this.becaService.deleteBeca(id).subscribe({
      next: (response: any) => {
        console.log('Beca eliminada con éxito', response);
        this.successMessage = 'Beca eliminada correctamente';
        this.loadBecas();
      },
      error: (error: any) => {
        console.error('Error al eliminar la beca', error);
        this.errorMessage = error.message;
      },
    });
  }
}
