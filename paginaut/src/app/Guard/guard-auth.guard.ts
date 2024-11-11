import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';

export const guardAuthGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  // Obtener el estado de autenticación y permisos de administrador
  const { isAuthenticated, isAdmin } = usuarioService.isAuth();

  // Verificar si el usuario ya está autenticado y está intentando acceder a la página de login
  if (isAuthenticated && route.routeConfig?.path === 'login') {
    // Si el usuario está autenticado y la ruta es 'login', redirige a 'home'
    router.navigate(['/admin/principal_admin']);
    return false;
  }

  // Si no está autenticado, redirige a la página de login
  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  // Permitir el acceso si es administrador
  if (isAdmin) {
    return true;
  }

  // Si no es administrador, redirige a la página de acceso denegado
  router.navigate(['/acceso-denegado']);
  return false;
};
