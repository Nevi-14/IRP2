import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfiguracionMapaPage } from './configuracion-mapa.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionMapaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionMapaPageRoutingModule {}
