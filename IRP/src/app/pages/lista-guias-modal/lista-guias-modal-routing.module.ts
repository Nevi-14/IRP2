import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaGuiasModalPage } from './lista-guias-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ListaGuiasModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaGuiasModalPageRoutingModule {}
