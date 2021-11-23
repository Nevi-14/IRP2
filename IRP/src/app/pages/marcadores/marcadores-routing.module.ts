import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarcadoresPage } from './marcadores.page';

const routes: Routes = [
  {
    path: '',
    component: MarcadoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarcadoresPageRoutingModule {}
