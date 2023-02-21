import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteGuiasPage } from './reporte-guias.page';
 
const routes: Routes = [
  {
    path: '',
    component: ReporteGuiasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteGuiasPageRoutingModule {}
