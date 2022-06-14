import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusquedaMapaPage } from './busqueda-mapa.page';

const routes: Routes = [
  {
    path: '',
    component: BusquedaMapaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusquedaMapaPageRoutingModule {}
