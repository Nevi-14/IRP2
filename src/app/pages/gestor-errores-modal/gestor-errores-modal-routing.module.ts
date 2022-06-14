import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestorErroresModalPage } from './gestor-errores-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GestorErroresModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestorErroresModalPageRoutingModule {}
