import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';

export const guardAuthGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  
  const { isAuthenticated, isAdmin } = usuarioService.isAuth();

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  if (isAdmin) {
    return true;
  }

  // Si no es administrador, redirige a la página de acceso denegado
  router.navigate(['/acceso-denegado']);
  return false;
};
