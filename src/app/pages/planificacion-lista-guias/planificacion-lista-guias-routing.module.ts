import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificacionListaGuiasPage } from './planificacion-lista-guias.page';

const routes: Routes = [
  {
    path: '',
    component: PlanificacionListaGuiasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificacionListaGuiasPageRoutingModule {}
