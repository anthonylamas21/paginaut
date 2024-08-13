import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BolsaTrabajoService, Bolsa } from '../bolsa-trabajo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-bolsatrabajo',
  templateUrl: './crear-bolsatrabajo.component.html',
  styleUrls: ['./crear-bolsatrabajo.component.css'],
})
export class CrearBolsatrabajoComponent implements OnInit {
  bolsaForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  isViewModalOpen: boolean = false;
  bolsas: Bolsa[] = [];
  filteredBolsas: Bolsa[] = [];
  papeleraBolsas: Bolsa[] = [];
  currentBolsaId?: number;
  currentBolsa?: Bolsa;
  selectedBolsa?: Bolsa;
  currentTab: 'active' | 'inactive' = 'active';
  fileToUpload: File | null = null;
  currentFileName: string = '';
  baseImageUrl = 'http://localhost/paginaut/';

  constructor(
    private fb: FormBuilder,
    private bolsaService: BolsaTrabajoService,
    public sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
    this.bolsaForm = this.fb.group({
      nombre_empresa: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      requisitos: this.fb.array([]),
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.maxLength(15)]],
      correo: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
      horarios: this.fb.array([]),
      puesto: ['', [Validators.required, Validators.maxLength(50)]],
      archivo: [''],
    });
  }

  ngOnInit(): void {
    this.loadBolsas();
    this.setNavbarColor();

    // Suscribirse a los cambios en el formulario para validar dinámicamente
    this.bolsaForm.statusChanges.subscribe(() => {
      this.isFormValid();
    });
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
    const navbar = document.getElementById('navbarAccion');
    const inicioSection = document.getElementById('inicio');

    if (inicioSection && navbar) {
      const inicioSectionBottom = inicioSection.getBoundingClientRect().bottom;

      if (window.scrollY > inicioSectionBottom) {
        button?.classList.remove('hidden');
      } else {
        button?.classList.add('hidden');
      }

      navbar.classList.remove('bg-transparent');
      navbar.classList.add('bg-[#043D3D]');
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      const formData: FormData = new FormData();
      formData.append(
        'nombre_empresa',
        this.bolsaForm.get('nombre_empresa')?.value
      );
      formData.append('descripcion', this.bolsaForm.get('descripcion')?.value);
      formData.append(
        'requisitos',
        JSON.stringify(this.bolsaForm.get('requisitos')?.value)
      );
      formData.append('direccion', this.bolsaForm.get('direccion')?.value);
      formData.append('telefono', this.bolsaForm.get('telefono')?.value);
      formData.append('correo', this.bolsaForm.get('correo')?.value);
      formData.append(
        'horarios',
        JSON.stringify(this.bolsaForm.get('horarios')?.value)
      );
      formData.append('puesto', this.bolsaForm.get('puesto')?.value);
      if (this.fileToUpload) {
        formData.append('archivo', this.fileToUpload, this.fileToUpload.name);
      } else {
        formData.append('archivo', this.currentFileName);
      }

      if (this.currentBolsaId) {
        formData.append('id', this.currentBolsaId.toString());
        this.bolsaService.updateBolsa(formData).subscribe({
          next: (response: any) => {
            this.showToast(
              'success',
              'Bolsa de trabajo actualizada correctamente'
            );
            this.loadBolsas();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      } else {
        this.bolsaService.addBolsa(formData).subscribe({
          next: (response: any) => {
            this.showToast(
              'success',
              'Bolsa de trabajo agregada correctamente'
            );
            this.loadBolsas();
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
    if (file && file.type === 'application/pdf') {
      this.fileToUpload = file;
    } else {
      this.bolsaForm.get('archivo')?.setErrors({ ['invalidFileType']: true });
      this.fileToUpload = null;
    }
  }

  validateInput(event: KeyboardEvent) {
    const allowedKeys = /^[a-zA-Z0-9\s]*$/;
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }
  }

  resetForm() {
    this.bolsaForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentBolsaId = undefined;
    this.currentBolsa = undefined;
    this.currentFileName = '';
    this.fileToUpload = null;
    this.bolsaForm.setControl('horarios', this.fb.array([]));
    this.bolsaForm.setControl('requisitos', this.fb.array([]));
  }

  openModal(bolsa?: Bolsa) {
    if (bolsa) {
      this.currentBolsaId = bolsa.id;
      this.currentBolsa = bolsa;
      this.currentFileName = bolsa.archivo;
      this.bolsaForm.patchValue({
        nombre_empresa: bolsa.nombre_empresa,
        descripcion: bolsa.descripcion,
        direccion: bolsa.direccion,
        telefono: bolsa.telefono,
        correo: bolsa.correo,
        puesto: bolsa.puesto,
      });
      this.populateHorarios(bolsa.horarios);
      this.populateRequisitos(bolsa.requisitos);
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openViewModal(bolsa: Bolsa) {
    this.selectedBolsa = bolsa;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
  }

  loadBolsas() {
    this.bolsaService.getBolsas().subscribe({
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
        this.bolsaService.deleteBolsa(id).subscribe({
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
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres mover esta bolsa de trabajo a la papelera?',
      () => {
        this.bolsaService.updateBolsaStatus(id, false).subscribe({
          next: (response: any) => {
            this.showToast(
              'success',
              'Bolsa de trabajo movida a la papelera correctamente'
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

  activateBolsa(id: number) {
    const bolsaToUpdate = this.bolsas.find((bolsa) => bolsa.id === id);
    if (bolsaToUpdate) {
      bolsaToUpdate.activo = true;
      const formData: FormData = new FormData();
      formData.append('id', bolsaToUpdate.id!.toString());
      formData.append('nombre_empresa', bolsaToUpdate.nombre_empresa);
      formData.append('descripcion', bolsaToUpdate.descripcion);
      formData.append('activo', 'true');
      this.bolsaService.updateBolsa(formData).subscribe({
        next: (response: any) => {
          this.showToast('success', 'Bolsa de trabajo activada correctamente');
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

  viewBolsa(bolsa: Bolsa) {
    this.selectedBolsa = bolsa;
    this.isViewModalOpen = true;
  }

  mostrar(elemento: any): void {
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
        }
      }
    }
  }

  addHorario() {
    const horarioGroup = this.fb.group({
      dia: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      cerrado: [false],
    });

    horarioGroup
      .get('cerrado')
      ?.valueChanges.subscribe((isCerrado: boolean | null) => {
        if (isCerrado) {
          horarioGroup.get('horaInicio')?.disable();
          horarioGroup.get('horaFin')?.disable();
        } else {
          horarioGroup.get('horaInicio')?.enable();
          horarioGroup.get('horaFin')?.enable();
        }
      });

    this.horarios.push(horarioGroup);
  }

  removeHorario(index: number) {
    const horarios = this.bolsaForm.get('horarios') as FormArray;
    horarios.removeAt(index);
  }

  get horarios() {
    return this.bolsaForm.get('horarios') as FormArray;
  }

  get requisitos() {
    return this.bolsaForm.get('requisitos') as FormArray;
  }

  populateHorarios(horariosData: any[]) {
    const horarios = this.bolsaForm.get('horarios') as FormArray;
    horarios.clear(); // Limpiar horarios antes de poblarlos
    horariosData.forEach((horario) => {
      const horarioGroup = this.fb.group({
        dia: [horario.dia, Validators.required],
        horaInicio: [horario.horaInicio, Validators.required],
        horaFin: [horario.horaFin, Validators.required],
        cerrado: [horario.cerrado],
      });

      horarioGroup
        .get('cerrado')
        ?.valueChanges.subscribe((isCerrado: boolean | null) => {
          if (isCerrado) {
            horarioGroup.get('horaInicio')?.disable();
            horarioGroup.get('horaFin')?.disable();
          } else {
            horarioGroup.get('horaInicio')?.enable();
            horarioGroup.get('horaFin')?.enable();
          }
        });

      if (horario.cerrado) {
        horarioGroup.get('horaInicio')?.disable();
        horarioGroup.get('horaFin')?.disable();
      }

      horarios.push(horarioGroup);
    });
  }

  addRequisito() {
    const requisitos = this.bolsaForm.get('requisitos') as FormArray;
    requisitos.push(
      this.fb.group({
        descripcion: ['', Validators.required],
      })
    );
  }

  removeRequisito(index: number) {
    const requisitos = this.bolsaForm.get('requisitos') as FormArray;
    requisitos.removeAt(index);
  }

  populateRequisitos(requisitosData: any[]) {
    const requisitos = this.bolsaForm.get('requisitos') as FormArray;
    requisitos.clear(); // Limpiar requisitos antes de poblarlos
    requisitosData.forEach((requisito) => {
      requisitos.push(
        this.fb.group({
          descripcion: [requisito.descripcion, Validators.required],
        })
      );
    });
  }

  isFormValid(): boolean {
    const isValid =
      this.bolsaForm.valid && this.horarios.valid && this.requisitos.valid;
    return isValid;
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
}
