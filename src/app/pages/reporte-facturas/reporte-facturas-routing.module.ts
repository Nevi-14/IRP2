import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteFacturasPage } from './reporte-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteFacturasPageRoutingModule {}
