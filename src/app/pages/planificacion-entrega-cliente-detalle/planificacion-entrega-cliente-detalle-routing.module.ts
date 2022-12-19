import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificacionEntregaClienteDetallePage } from './planificacion-entrega-cliente-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: PlanificacionEntregaClienteDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificacionEntregaClienteDetallePageRoutingModule {}
