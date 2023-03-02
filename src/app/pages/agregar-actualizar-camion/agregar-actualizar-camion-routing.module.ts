import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarActualizarCamionPage } from './agregar-actualizar-camion.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarActualizarCamionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarActualizarCamionPageRoutingModule {}
