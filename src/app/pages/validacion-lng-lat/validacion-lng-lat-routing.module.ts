import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidacionLngLatPage } from './validacion-lng-lat.page';

const routes: Routes = [
  {
    path: '',
    component: ValidacionLngLatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidacionLngLatPageRoutingModule {}
