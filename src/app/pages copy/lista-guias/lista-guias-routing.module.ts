import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaGuiasPage } from './lista-guias.page';

const routes: Routes = [
  {
    path: '',
    component: ListaGuiasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaGuiasPageRoutingModule {}
