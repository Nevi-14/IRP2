import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientesRutasPage } from './clientes-rutas.page';

const routes: Routes = [
  {
    path: '',
    component: ClientesRutasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesRutasPageRoutingModule {}
