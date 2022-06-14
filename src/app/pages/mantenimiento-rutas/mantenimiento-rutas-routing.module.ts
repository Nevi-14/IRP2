import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoRutasPage } from './mantenimiento-rutas.page';

const routes: Routes = [
  {
    path: '',
    component: MantenimientoRutasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MantenimientoRutasPageRoutingModule {}
