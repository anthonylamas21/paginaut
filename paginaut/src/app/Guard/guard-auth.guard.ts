import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';

export const guardAuthGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  
  const { isAuthenticated, isAdmin, isUser, departamento } = usuarioService.isAuth();

  // Rutas permitidas para cada rol y departamento
  const adminRoutes = ['/admin', '/usuarios', '/reportes'];
  const userRoutes = ['/dashboard', '/perfil'];
  
  // Rutas específicas por departamento (ejemplo)
  const departamentoRoutes = {
    'vinculacion': ['/vinculacion-dashboard', '/vinculacion-proyectos'],
    'contaduria': ['/contaduria-dashboard', '/contaduria-informes'],
    'rectoria': ['/rectoria-dashboard', '/rectoria-decisiones']
  };

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  if (isAdmin && adminRoutes.includes(state.url)) {
    return true;
  }

  if (isUser) {
    if (userRoutes.includes(state.url)) {
      return true;
    }
    
    /* Verificar rutas específicas del departamento
    if (departamento && departamentoRoutes[departamento]) {
      if (departamentoRoutes[departamento].includes(state.url)) {
        return true;
      }
    }*/
  }

  // Si no tiene permisos para la ruta actual
  router.navigate(['/acceso-denegado']);
  return false;
};