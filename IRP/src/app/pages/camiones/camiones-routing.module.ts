import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CamionesPage } from './camiones.page';

const routes: Routes = [
  {
    path: '',
    component: CamionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamionesPageRoutingModule {}
