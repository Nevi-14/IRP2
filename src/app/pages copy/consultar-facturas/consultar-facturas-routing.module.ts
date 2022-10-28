import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultarFacturasPage } from './consultar-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultarFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultarFacturasPageRoutingModule {}
