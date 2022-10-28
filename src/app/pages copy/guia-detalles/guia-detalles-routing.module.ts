import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuiaDetallesPage } from './guia-detalles.page';

const routes: Routes = [
  {
    path: '',
    component: GuiaDetallesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuiaDetallesPageRoutingModule {}
