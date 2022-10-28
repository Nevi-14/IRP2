import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacturasNoAgregadasPage } from './facturas-no-agregadas.page';

const routes: Routes = [
  {
    path: '',
    component: FacturasNoAgregadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturasNoAgregadasPageRoutingModule {}
