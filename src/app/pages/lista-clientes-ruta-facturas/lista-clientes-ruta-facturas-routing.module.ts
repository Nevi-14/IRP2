import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaClientesRutaFacturasPage } from './lista-clientes-ruta-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: ListaClientesRutaFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaClientesRutaFacturasPageRoutingModule {}
