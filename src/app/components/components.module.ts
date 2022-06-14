import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniMapaComponent } from './mini-mapa/mini-mapa.component';
import { MapaComponent } from './mapa/mapa.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { RutaMapaComponent } from './ruta-mapa/ruta-mapa.component';



@NgModule({
  declarations: [MiniMapaComponent,MapaComponent, RutaMapaComponent],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  exports: [
  MiniMapaComponent,MapaComponent,RutaMapaComponent

  ]
})
export class ComponentsModule { }
