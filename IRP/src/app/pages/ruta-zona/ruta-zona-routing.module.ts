import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaZonaPage } from './ruta-zona.page';

const routes: Routes = [
  {
    path: '',
    component: RutaZonaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaZonaPageRoutingModule {}
