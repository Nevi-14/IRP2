import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaRutasZonasModalPage } from './lista-rutas-zonas-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ListaRutasZonasModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaRutasZonasModalPageRoutingModule {}
