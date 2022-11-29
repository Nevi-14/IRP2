import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuteroClientesPage } from './rutero-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: RuteroClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RuteroClientesPageRoutingModule {}
