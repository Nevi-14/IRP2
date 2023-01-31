import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificacionEntregasVistaMapaPage } from './planificacion-entregas-vista-mapa.page';

const routes: Routes = [
  {
    path: '',
    component: PlanificacionEntregasVistaMapaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificacionEntregasVistaMapaPageRoutingModule {}
