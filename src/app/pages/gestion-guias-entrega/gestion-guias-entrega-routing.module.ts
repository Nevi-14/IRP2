import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionGuiasEntregaPage } from './gestion-guias-entrega.page';

const routes: Routes = [
  {
    path: '',
    component: GestionGuiasEntregaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionGuiasEntregaPageRoutingModule {}
