import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutasPageRoutingModule } from './rutas-routing.module';

import { RutasPage } from './rutas.page';
import { FiltroPipe } from '../../pipes/filtro.pipe';
import { RutasPipe } from 'src/app/pipes/rutas.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutasPageRoutingModule
  ],
  declarations: [RutasPage, FiltroPipe,RutasPipe]
})
export class RutasPageModule {}
