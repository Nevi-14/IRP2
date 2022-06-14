import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificacionEntregasPage } from './planificacion-entregas.page';

const routes: Routes = [
  {
    path: '',
    component: PlanificacionEntregasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificacionEntregasPageRoutingModule {}
