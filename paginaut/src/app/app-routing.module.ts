import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ComponentesComponent } from './componentes/componentes.component';

const routes: Routes = [
  { path: '', redirectTo: '/principal', pathMatch: 'full' }, // Ruta por defecto
  { path: 'principal', component: PrincipalComponent }, 

  //Rutas 
  {path: 'principal', component: PrincipalComponent },
  {path: 'navbar', component: NavbarComponent },
  {path: 'componentes', component: ComponentesComponent}

];

@NgModule({
  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 










