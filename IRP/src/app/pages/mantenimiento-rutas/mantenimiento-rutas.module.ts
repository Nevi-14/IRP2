import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MantenimientoRutasPageRoutingModule } from './mantenimiento-rutas-routing.module';

import { MantenimientoRutasPage } from './mantenimiento-rutas.page';
import { FiltroPipe } from '../../pipes/filtro.pipe';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MantenimientoRutasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MantenimientoRutasPage,FiltroPipe]
})
export class MantenimientoRutasPageModule {}
