import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificacionEntregaClientesPage } from './planificacion-entrega-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: PlanificacionEntregaClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificacionEntregaClientesPageRoutingModule {}
