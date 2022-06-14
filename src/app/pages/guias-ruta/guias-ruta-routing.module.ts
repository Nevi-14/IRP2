import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuiasRutaPage } from './guias-ruta.page';

const routes: Routes = [
  {
    path: '',
    component: GuiasRutaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuiasRutaPageRoutingModule {}
