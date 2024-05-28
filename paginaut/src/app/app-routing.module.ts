import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { PrincipalComponent } from './principal/principal.component';
import { BolsadetrabajoComponent } from './bolsadetrabajo/bolsadetrabajo.component';
import { ConocenosComponent } from './conocenos/conocenos.component';

const routes: Routes = [
  { path: '', redirectTo: '/principal', pathMatch: 'full' }, // Ruta por defecto
  { path: 'principal', component: PrincipalComponent }, 

  //Rutas 
  { path: 'bolsadetrabajo', component: BolsadetrabajoComponent },
  { path: 'conocenos', component: ConocenosComponent },
  {path: 'principal', component: PrincipalComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
