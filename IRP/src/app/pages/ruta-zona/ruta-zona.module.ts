import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaZonaPageRoutingModule } from './ruta-zona-routing.module';

import { RutaZonaPage } from './ruta-zona.page';
import { FiltroPipe } from '../../pipes/filtro.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaZonaPageRoutingModule
  ],
  declarations: [RutaZonaPage, FiltroPipe]
})
export class RutaZonaPageModule {}
