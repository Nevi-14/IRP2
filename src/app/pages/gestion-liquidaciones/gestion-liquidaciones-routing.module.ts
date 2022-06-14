import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionLiquidacionesPage } from './gestion-liquidaciones.page';

const routes: Routes = [
  {
    path: '',
    component: GestionLiquidacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionLiquidacionesPageRoutingModule {}
