import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientesSinUbicacionPage } from './clientes-sin-ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: ClientesSinUbicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesSinUbicacionPageRoutingModule {}
