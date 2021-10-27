import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuardarRutasPage } from './guardar-rutas.page';

const routes: Routes = [
  {
    path: '',
    component: GuardarRutasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuardarRutasPageRoutingModule {}
