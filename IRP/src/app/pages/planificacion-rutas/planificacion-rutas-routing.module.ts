import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificacionRutasPage } from './planificacion-rutas.page';

const routes: Routes = [
  {
    path: '',
    component: PlanificacionRutasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificacionPageRoutingModule {}
