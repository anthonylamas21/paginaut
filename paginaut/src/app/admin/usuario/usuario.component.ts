import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService, Usuario, Departamento, Rol } from '../../usuarioService/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  departamentos: Departamento[] = [];
  filteredUsuarios: Usuario[] = [];
  papeleraUsuarios: Usuario[] = [];
  currentUsuarioId?: number;
  currentTab: 'active' | 'inactive' = 'active';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.usuarioForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      rol_id: ['', [Validators.required]],
      departamento_id: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadUsuarios();
    this.loadRoles();
    this.loadDepartamentos();
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      const usuarioData: Usuario = this.usuarioForm.value;
      usuarioData.activo = true;
      if (this.currentUsuarioId) {
        usuarioData.id = this.currentUsuarioId;
        this.usuarioService.actualizarUsuario(usuarioData).subscribe({
          next: (response) => {
            console.log('Usuario actualizado con éxito', response);
            this.successMessage = 'Usuario actualizado correctamente';
            this.loadUsuarios();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al actualizar el usuario', error);
            this.errorMessage = error.message;
          },
        });
      } else {
        usuarioData.activo = true; // Set activo to true by default for new users
        this.usuarioService.agregarUsuario(usuarioData).subscribe({
          next: (response) => {
            console.log('Usuario agregado con éxito', response);
            this.successMessage = 'Usuario agregado correctamente';
            this.loadUsuarios();
            this.resetForm();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al agregar el usuario', error);
            this.errorMessage = error.message;
          },
        });
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }

  resetForm() {
    this.usuarioForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentUsuarioId = undefined;
  }

  openModal(usuario?: Usuario) {
    if (usuario) {
      this.currentUsuarioId = usuario.id;
      this.usuarioForm.patchValue(usuario);
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadRoles() {
    this.isLoading = true;
    this.usuarioService.obtenerRoles().subscribe({
      next: (response: any) => {
        this.roles = response.records;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los roles', error);
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  loadDepartamentos() {
    this.isLoading = true;
    this.usuarioService.obtenerDepartamentos().subscribe({
      next: (response: any) => {
        this.departamentos = response.records;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los roles', error);
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  loadUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (response: any) => {
        this.usuarios = response.records;
        this.filterUsuarios();
      },
      error: (error) => {
        console.error('Error al cargar los usuarios', error);
        this.errorMessage = error.message;
      },
    });
  }

  confirmDeleteUsuario(id: number | undefined) {
    if (id !== undefined) {
      this.changeUsuarioStatus(id, false);
    }
  }

  changeUsuarioStatus(id: number, status: boolean) {
    const usuarioToUpdate = this.usuarios.find((u) => u.id === id);
    if (usuarioToUpdate) {
      usuarioToUpdate.activo = status;
      this.usuarioService.actualizarUsuario(usuarioToUpdate).subscribe({
        next: (response) => {
          console.log('Usuario actualizado con éxito', response);
          this.successMessage = status
            ? 'Usuario activado correctamente'
            : 'Usuario enviado a la papelera correctamente';
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('Error al actualizar el usuario', error);
          this.errorMessage = error.message;
        },
      });
    }
  }

  deleteUsuario(id: number) {
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: (response) => {
        console.log('Usuario eliminado con éxito', response);
        this.successMessage = 'Usuario eliminado correctamente';
        this.loadUsuarios(); // Vuelve a cargar los usuarios después de eliminar
      },
      error: (error) => {
        console.error('Error al eliminar el usuario', error);
        this.errorMessage = error.message;
      },
    });
  }

  activateUsuario(id: number) {
    this.changeUsuarioStatus(id, true);
  }

  filterUsuarios() {
    this.filteredUsuarios = this.usuarios.filter(
      (usuario) => usuario.activo
    );
    this.papeleraUsuarios = this.usuarios.filter(
      (usuario) => !usuario.activo
    );
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.currentTab === 'active') {
      this.filteredUsuarios = this.usuarios.filter(
        (usuario) =>
          usuario.activo &&
          (usuario.correo.toLowerCase().includes(value) ||
            usuario.contrasena.toLowerCase().includes(value) ||
            (usuario.fecha_creacion &&
              usuario.fecha_creacion.includes(value)))
      );
    } else {
      this.papeleraUsuarios = this.usuarios.filter(
        (usuario) =>
          !usuario.activo &&
          (usuario.correo.toLowerCase().includes(value) ||
            usuario.contrasena.toLowerCase().includes(value) ||
            (usuario.fecha_creacion &&
              usuario.fecha_creacion.includes(value)))
      );
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterUsuarios();
  }
}
