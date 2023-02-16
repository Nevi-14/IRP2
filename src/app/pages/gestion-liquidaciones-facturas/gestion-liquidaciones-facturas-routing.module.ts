import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionLiquidacionesFacturasPage } from './gestion-liquidaciones-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: GestionLiquidacionesFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionLiquidacionesFacturasPageRoutingModule {}
