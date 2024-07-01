import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarrerasService, Carrera, Imagen } from '../carreras.service';

@Component({
  selector: 'app-carreras-admin',
  templateUrl: './carreras-admin.component.html',
  styleUrls: ['./carreras-admin.component.css'],
})
export class CarrerasAdminComponent implements OnInit {
  carreraForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  carreras: Carrera[] = [];
  filteredCarreras: Carrera[] = [];
  papeleraCarreras: Carrera[] = [];
  currentCarreraId?: number;
  currentTab: 'active' | 'inactive' = 'active';
  selectedImage: File | null = null;

  constructor(
    private fb: FormBuilder,
    private carrerasService: CarrerasService
  ) {
    this.carreraForm = this.fb.group({
      nombre_carrera: ['', [Validators.required, Validators.maxLength(100)]],
      perfil_profesional: ['', Validators.maxLength(1000)],
      ocupacion_profesional: ['', Validators.maxLength(1000)],
      direccion_id: ['', Validators.required],
      activo: [true],
    });
  }

  ngOnInit() {
    this.loadCarreras();
  }

  onSubmit() {
    if (this.carreraForm.valid) {
      const carreraData: Carrera = this.carreraForm.value;
      if (this.currentCarreraId) {
        carreraData.id = this.currentCarreraId;
        this.carrerasService.actualizarCarrera(carreraData).subscribe({
          next: (response) => {
            console.log('Carrera actualizada con éxito', response);
            this.successMessage = 'Carrera actualizada correctamente';
            this.loadCarreras();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al actualizar la carrera', error);
            this.errorMessage = error.message;
          },
        });
      } else {
        carreraData.activo = true; // Set activo to true by default for new carreras
        this.carrerasService.agregarCarrera(carreraData).subscribe({
          next: (response) => {
            console.log('Carrera agregada con éxito', response);
            this.successMessage = 'Carrera agregada correctamente';
            this.loadCarreras();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al agregar la carrera', error);
            this.errorMessage = error.message;
          },
        });
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }

  resetForm() {
    this.carreraForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentCarreraId = undefined;
    this.selectedImage = null;
  }

  openModal(carrera?: Carrera) {
    if (carrera) {
      this.currentCarreraId = carrera.id;
      this.carreraForm.patchValue(carrera);
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadCarreras() {
    this.carrerasService.obtenerCarreras().subscribe({
      next: (response: any) => {
        this.carreras = response.records;
        this.filterCarreras();
      },
      error: (error) => {
        console.error('Error al cargar las carreras', error);
      },
    });
  }

  confirmDeleteCarrera(id: number | undefined) {
    if (id !== undefined) {
      this.changeCarreraStatus(id, false);
    }
  }

  changeCarreraStatus(id: number, status: boolean) {
    const carreraToUpdate = this.carreras.find((c) => c.id === id);
    if (carreraToUpdate) {
      carreraToUpdate.activo = status;
      this.carrerasService.actualizarCarrera(carreraToUpdate).subscribe({
        next: (response) => {
          console.log('Carrera actualizada con éxito', response);
          this.successMessage = status
            ? 'Carrera activada correctamente'
            : 'Carrera enviada a la papelera correctamente';
          this.loadCarreras();
        },
        error: (error) => {
          console.error('Error al actualizar la carrera', error);
          this.errorMessage = error.message;
        },
      });
    }
  }

  deleteCarrera(id: number) {
    this.carrerasService.eliminarCarrera(id).subscribe({
      next: (response) => {
        console.log('Carrera eliminada con éxito', response);
        this.successMessage = 'Carrera eliminada correctamente';
        this.loadCarreras();
      },
      error: (error) => {
        console.error('Error al eliminar la carrera', error);
        this.errorMessage = error.message;
      },
    });
  }

  activateCarrera(id: number) {
    this.changeCarreraStatus(id, true);
  }

  filterCarreras() {
    this.filteredCarreras = this.carreras.filter((carrera) => carrera.activo);
    this.papeleraCarreras = this.carreras.filter((carrera) => !carrera.activo);
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.currentTab === 'active') {
      this.filteredCarreras = this.carreras.filter(
        (carrera) =>
          carrera.activo &&
          (carrera.nombre_carrera.toLowerCase().includes(value) ||
            carrera.perfil_profesional?.toLowerCase().includes(value) ||
            carrera.ocupacion_profesional?.toLowerCase().includes(value))
      );
    } else {
      this.papeleraCarreras = this.carreras.filter(
        (carrera) =>
          !carrera.activo &&
          (carrera.nombre_carrera.toLowerCase().includes(value) ||
            carrera.perfil_profesional?.toLowerCase().includes(value) ||
            carrera.ocupacion_profesional?.toLowerCase().includes(value))
      );
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterCarreras();
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0] as File;
  }

  uploadImage() {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('file', this.selectedImage);
      formData.append('accion', 'uploadImage');

      this.carrerasService.subirImagen(formData).subscribe({
        next: (response) => {
          console.log('Imagen subida con éxito', response);
          this.successMessage = 'Imagen subida correctamente';
          this.selectedImage = null;
        },
        error: (error) => {
          console.error('Error al subir la imagen', error);
          this.errorMessage = error.message;
        },
      });
    }
  }
}
