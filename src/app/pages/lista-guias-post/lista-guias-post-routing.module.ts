import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaGuiasPostPage } from './lista-guias-post.page';

const routes: Routes = [
  {
    path: '',
    component: ListaGuiasPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaGuiasPostPageRoutingModule {}
