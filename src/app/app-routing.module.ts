import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BolsadetrabajoComponent } from './bolsadetrabajo/bolsadetrabajo.component';
import { ConocenosComponent } from './conocenos/conocenos.component';

const routes: Routes = [
  { path: 'bolsadetrabajo', component: BolsadetrabajoComponent },
  { path: 'conocenos', component: ConocenosComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
