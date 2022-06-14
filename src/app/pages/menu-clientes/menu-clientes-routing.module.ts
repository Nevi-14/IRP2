import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuClientesPage } from './menu-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: MenuClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuClientesPageRoutingModule {}
