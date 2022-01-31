import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MantenimientoRutasPageRoutingModule } from './mantenimiento-rutas-routing.module';

import { MantenimientoRutasPage } from './mantenimiento-rutas.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MantenimientoRutasPageRoutingModule,
    PipesModule,
    ComponentsModule
  ],
  declarations: [MantenimientoRutasPage]
})
export class MantenimientoRutasPageModule {}
