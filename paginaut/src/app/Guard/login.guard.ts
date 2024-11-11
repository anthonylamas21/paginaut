import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class loginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verificar si el token existe en el localStorage
    if (localStorage.getItem('token')) {
      // Redirigir a otra ruta, por ejemplo, la página de inicio
      this.router.navigate(['/admin/principal_admin']);
      return false; // Bloquea el acceso al componente de login
    }
    return true; // Permite el acceso si no hay token
  }
}
