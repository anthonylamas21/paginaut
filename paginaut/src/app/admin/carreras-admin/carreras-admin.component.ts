
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { CarreraService, Carrera } from '../carreras.service';

import { Table,TableModule } from 'primeng/table';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-carreras-admin',
  templateUrl: './carreras-admin.component.html',
  styleUrls: ['./carreras-admin.component.css']
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

    @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }

  
  constructor(
    private fb: FormBuilder,
    private carreraService: CarreraService
  ) {
    this.carreraForm = this.fb.group({
      nombre_carrera: ['', [Validators.required, Validators.maxLength(100)]],
      perfil_profesional: this.fb.array([]),
      ocupacion_profesional: this.fb.array([])
    });
  }

  get perfilProfesional(): FormArray {
    return this.carreraForm.get('perfil_profesional') as FormArray;
  }

  get ocupacionProfesional(): FormArray {
    return this.carreraForm.get('ocupacion_profesional') as FormArray;
  }

  ngOnInit(): void {
    this.loadCarreras();
     this.setNavbarColor();

  }
  


  onSubmit() {
    if (this.carreraForm.valid) {
      const carreraData: Carrera = this.carreraForm.value;
      carreraData.perfil_profesional = this.perfilProfesional.value;
      carreraData.ocupacion_profesional = this.ocupacionProfesional.value;

      if (this.currentCarreraId) {
        carreraData.id = this.currentCarreraId;
        this.carreraService.actualizarCarrera(carreraData).subscribe({
          next: (response: any) => {
            this.successMessage = 'Carrera actualizada correctamente';
            this.loadCarreras();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            this.errorMessage = error.message;
          }
        });
      } else {
        this.carreraService.agregarCarrera(carreraData).subscribe({
          next: (response: any) => {
            this.successMessage = 'Carrera agregada correctamente';
            this.loadCarreras();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            this.errorMessage = error.message;
          }
        });
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }

  resetForm() {
    this.carreraForm.reset();
    this.perfilProfesional.clear();
    this.ocupacionProfesional.clear();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentCarreraId = undefined;
  }

  openModal(carrera?: Carrera) {
    if (carrera) {
      this.currentCarreraId = carrera.id;
      this.carreraForm.patchValue(carrera);
      this.setFormArray('perfil_profesional', carrera.perfil_profesional);
      this.setFormArray('ocupacion_profesional', carrera.ocupacion_profesional);
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadCarreras() {
    this.carreraService.obtenerCarreras().subscribe({
      next: (response: any) => {
        this.carreras = response.records;
        this.filterCarreras();
      },
      error: (error: any) => {
        console.error('Error al cargar las carreras', error);
      }
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
      this.carreraService.actualizarCarrera(carreraToUpdate).subscribe({
        next: (response: any) => {
          this.successMessage = status
            ? 'Carrera activada correctamente'
            : 'Carrera enviada a la papelera correctamente';
          this.loadCarreras();
        },
        error: (error: any) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

  deleteCarrera(id: number) {
    this.carreraService.eliminarCarrera(id).subscribe({
      next: (response: any) => {
        this.successMessage = 'Carrera eliminada correctamente';
        this.loadCarreras();
      },
      error: (error: any) => {
        this.errorMessage = error.message;
      }
    });
  }

  activateCarrera(id: number) {
    this.changeCarreraStatus(id, true);
  }

  filterCarreras() {
    this.filteredCarreras = this.carreras.filter(
      (carrera) => carrera.activo
    );
    this.papeleraCarreras = this.carreras.filter(
      (carrera) => !carrera.activo
    );
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.currentTab === 'active') {
      this.filteredCarreras = this.carreras.filter(
        (carrera) =>
          carrera.activo &&
          (carrera.nombre_carrera.toLowerCase().includes(value) ||
            (carrera.perfil_profesional &&
              carrera.perfil_profesional.some((item) =>
                item.toLowerCase().includes(value)
              )) ||
            (carrera.ocupacion_profesional &&
              carrera.ocupacion_profesional.some((item) =>
                item.toLowerCase().includes(value)
              )))
      );
    } else {
      this.papeleraCarreras = this.carreras.filter(
        (carrera) =>
          !carrera.activo &&
          (carrera.nombre_carrera.toLowerCase().includes(value) ||
            (carrera.perfil_profesional &&
              carrera.perfil_profesional.some((item) =>
                item.toLowerCase().includes(value)
              )) ||
            (carrera.ocupacion_profesional &&
              carrera.ocupacion_profesional.some((item) =>
                item.toLowerCase().includes(value)
              )))
      );
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterCarreras();
  }

  addPerfilProfesional() {
    this.perfilProfesional.push(this.fb.control(''));
  }

  removePerfilProfesional(index: number) {
    this.perfilProfesional.removeAt(index);
  }

  addOcupacionProfesional() {
    this.ocupacionProfesional.push(this.fb.control(''));
  }

  removeOcupacionProfesional(index: number) {
    this.ocupacionProfesional.removeAt(index);
  }

  private setFormArray(arrayName: string, values: string[]) {
    const formArray = this.carreraForm.get(arrayName) as FormArray;
    formArray.clear();
    if (values) {
      values.forEach((value) => {
        formArray.push(this.fb.control(value));
      });
    }
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
  
  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  
}

}

