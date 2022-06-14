import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlFacturasPage } from './control-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: ControlFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlFacturasPageRoutingModule {}
