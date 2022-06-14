import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicioClienteMarcadoresPage } from './servicio-cliente-marcadores.page';

const routes: Routes = [
  {
    path: '',
    component: ServicioClienteMarcadoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicioClienteMarcadoresPageRoutingModule {}
