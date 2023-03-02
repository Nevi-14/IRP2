import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionTelefonosPage } from './gestion-telefonos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionTelefonosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionTelefonosPageRoutingModule {}
