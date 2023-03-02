import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarActualizarTelefonoPage } from './agregar-actualizar-telefono.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarActualizarTelefonoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarActualizarTelefonoPageRoutingModule {}
