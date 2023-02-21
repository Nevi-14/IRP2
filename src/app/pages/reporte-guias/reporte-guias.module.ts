import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

 

import { PipesModule } from '../../pipes/pipes.module';
import { ReporteGuiasPage } from './reporte-guias.page';
import { ReporteGuiasPageRoutingModule } from './reporte-guias-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteGuiasPageRoutingModule,
    PipesModule
  ],
  declarations: [ReporteGuiasPage]
})
export class ReporteGuiasPageModule {}
