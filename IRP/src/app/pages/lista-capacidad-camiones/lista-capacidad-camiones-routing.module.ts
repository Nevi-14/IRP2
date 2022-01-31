import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaCapacidadCamionesPage } from './lista-capacidad-camiones.page';

const routes: Routes = [
  {
    path: '',
    component: ListaCapacidadCamionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaCapacidadCamionesPageRoutingModule {}
