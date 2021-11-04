import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaFacturasPage } from './ruta-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: RutaFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaFacturasPageRoutingModule {}
