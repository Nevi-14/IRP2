import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MantenimientoRutasPageRoutingModule } from './mantenimiento-rutas-routing.module';

import { MantenimientoRutasPage } from './mantenimiento-rutas.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MantenimientoRutasPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [MantenimientoRutasPage]
})
export class MantenimientoRutasPageModule {}
