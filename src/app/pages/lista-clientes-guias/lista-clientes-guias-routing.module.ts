import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaClientesGuiasPage } from './lista-clientes-guias.page';

const routes: Routes = [
  {
    path: '',
    component: ListaClientesGuiasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaClientesGuiasPageRoutingModule {}
