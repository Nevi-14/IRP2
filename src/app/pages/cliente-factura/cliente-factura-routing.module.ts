import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClienteFacturaPage } from './cliente-factura.page';

const routes: Routes = [
  {
    path: '',
    component: ClienteFacturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteFacturaPageRoutingModule {}
