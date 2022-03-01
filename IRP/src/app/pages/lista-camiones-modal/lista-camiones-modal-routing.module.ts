import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaCamionesModalPage } from './lista-camiones-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ListaCamionesModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaCamionesModalPageRoutingModule {}
